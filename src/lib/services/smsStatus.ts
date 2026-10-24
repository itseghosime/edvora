// ==============================================================================
// Edvora School Management — Termii SMS Delivery Status Mapper & State Machine
// Replaces substring matching with explicit provider mappings.
// Preserves terminal delivered outcomes against stale or out-of-order events.
// ==============================================================================

export type SMSDeliveryStatus = 'sent' | 'delivered' | 'failed' | 'expired' | 'rejected' | 'unknown';

/**
 * Explicit mapping of Termii SMS Delivery Report (DLR) raw status strings.
 * Note: Never use substring matching (.includes('deliver')) because strings like
 * 'undelivered' contain 'deliver' and would incorrectly map to delivered.
 */
export const TERMII_STATUS_MAPPING: Record<string, SMSDeliveryStatus> = {
  // Delivered status variants
  'delivered': 'delivered',
  'dlr:delivered': 'delivered',
  'successful': 'delivered',

  // Sent / in-transit variants
  'sent': 'sent',
  'dlr:sent': 'sent',
  'accepted': 'sent',

  // Undelivered / Failed variants (Explicit!)
  'failed': 'failed',
  'dlr:failed': 'failed',
  'undelivered': 'failed',
  'dlr:undelivered': 'failed',
  'unreachable': 'failed',

  // Expired variants
  'expired': 'expired',
  'dlr:expired': 'expired',

  // Rejected variants
  'rejected': 'rejected',
  'dlr:rejected': 'rejected',
  'dnd_rejected': 'rejected',
};

/**
 * Explicitly maps raw provider delivery status to canonical internal status.
 */
export function mapTermiiProviderStatus(rawStatus: string | undefined | null): SMSDeliveryStatus {
  if (!rawStatus) return 'unknown';
  const normalized = rawStatus.trim().toLowerCase();
  return TERMII_STATUS_MAPPING[normalized] || 'unknown';
}

/**
 * State Transition Guard:
 * Prevents stale, delayed, or out-of-order events from downgrading a terminal outcome.
 *
 * Rules:
 * 1. Once 'delivered', an attempt must NEVER be regressed to 'sent', 'failed', 'expired', 'rejected', or 'unknown'.
 * 2. If already 'failed' or 'rejected', do not regress to 'sent'.
 */
export function canTransitionAttemptStatus(
  currentStatus: string,
  newStatus: SMSDeliveryStatus
): boolean {
  const normCurrent = currentStatus.trim().toLowerCase();

  // Terminal state: Delivered cannot be overwritten
  if (normCurrent === 'delivered') {
    return false;
  }

  // Failed/Rejected terminal state: Cannot regress back to in-flight 'sent'
  if ((normCurrent === 'failed' || normCurrent === 'rejected') && newStatus === 'sent') {
    return false;
  }

  return true;
}


