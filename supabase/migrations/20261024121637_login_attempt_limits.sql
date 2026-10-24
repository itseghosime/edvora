CREATE TABLE public.login_attempt_windows (
 key_hash text PRIMARY KEY CHECK(length(key_hash)=64),
 window_start timestamptz NOT NULL DEFAULT now(),attempt_count integer NOT NULL DEFAULT 0
);
ALTER TABLE public.login_attempt_windows ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.login_attempt_windows FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.login_attempt_windows TO service_role;
CREATE POLICY server_login_limits ON public.login_attempt_windows FOR ALL TO service_role USING(true) WITH CHECK(true);
CREATE FUNCTION public.consume_login_budget(p_key text) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE attempt login_attempt_windows%ROWTYPE;
BEGIN
 IF length(p_key)<>64 THEN RAISE EXCEPTION 'Invalid login key' USING ERRCODE='22023'; END IF;
 INSERT INTO login_attempt_windows(key_hash,attempt_count) VALUES(p_key,1)
 ON CONFLICT(key_hash) DO UPDATE SET attempt_count=CASE WHEN login_attempt_windows.window_start<now()-interval '15 minutes' THEN 1 ELSE least(login_attempt_windows.attempt_count+1,11) END,
 window_start=CASE WHEN login_attempt_windows.window_start<now()-interval '15 minutes' THEN now() ELSE login_attempt_windows.window_start END
 RETURNING * INTO attempt;
 RETURN jsonb_build_object('allowed',attempt.attempt_count<=10,'retry_after',greatest(1,ceil(extract(epoch from attempt.window_start+interval '15 minutes'-now()))));
END; $$;
REVOKE ALL ON FUNCTION public.consume_login_budget(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.consume_login_budget(text) TO service_role;
