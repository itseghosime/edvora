import type { Metadata } from "next";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import PublicAccordion from "@/components/public/PublicAccordion";

export const metadata: Metadata = { title: "School Fees | Edvora", description: "Understand fee assignments, verified payments and receipts through the Edvora Student portal." };
export default function FeesPage() {
 return <div data-page="fees" className="public-site min-h-screen flex flex-col bg-surface text-on-surface">
  <PublicNavbar />
  <main id="main-content" className="public-main flex-1">
   <section><div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
    <div className="lg:col-span-7 space-y-6"><span className="text-sm font-semibold text-primary uppercase tracking-wider">Clarity for families</span><h1 className="font-display-lg text-display-lg">School fees, clearly explained.</h1><p className="text-lg text-on-surface-variant">View your child’s assigned fees, pay securely and keep track of receipts in one place. Parents use the Student portal for all payments.</p><div className="flex flex-wrap gap-3"><Link href="/login" className="inline-flex rounded-xl bg-primary text-on-primary px-6 py-3 font-semibold">Open Student portal</Link><Link href="/contact#enquiry" className="inline-flex rounded-xl bg-surface-container text-primary px-6 py-3 font-semibold">Prepare a fees enquiry</Link></div></div>
    <div className="lg:col-span-5 rounded-3xl bg-surface-container p-8 space-y-5"><span aria-hidden="true" className="material-symbols-outlined text-primary text-4xl">receipt_long</span><h2 className="text-2xl font-semibold">Your child’s balance is personal.</h2><p className="text-on-surface-variant">Fees depend on the class, term and the school’s approved plan. Your signed-in Student account shows the assigned charge, verified payments and outstanding balance.</p><p className="text-sm text-on-surface-variant">Public example prices do not replace a pupil’s fee assignment. Confirm any additional items with the school before paying.</p></div>
   </div></section>
   <section className="bg-surface-container-low"><div className="max-w-7xl mx-auto space-y-8"><h2 className="font-headline-lg text-headline-lg">From fee assignment to receipt</h2><ol className="grid gap-5 md:grid-cols-3">{[
    ["1", "Review the assignment", "Sign in with the pupil’s admission number and password. Check the current term and balance before starting a payment."],
    ["2", "Complete checkout", "Start payment from the Student portal and complete the provider’s checkout. A canceled or failed payment does not reduce the balance."],
    ["3", "Keep the receipt", "After the server verifies a successful payment, the balance updates and its receipt becomes available in the Student portal."],
   ].map(([number,title,body])=><li key={number} className="rounded-2xl bg-surface-container-lowest p-6"><span className="inline-flex h-10 w-10 rounded-full bg-primary text-on-primary items-center justify-center font-semibold">{number}</span><h3 className="font-semibold text-xl mt-5 mb-3">{title}</h3><p className="text-on-surface-variant">{body}</p></li>)}</ol></div></section>
   <section><div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10"><div className="space-y-5"><h2 className="font-headline-lg text-headline-lg">Questions before paying?</h2><p className="text-on-surface-variant">Ask the school office about class fee plans, additional items and approved instalments. Account corrections and fee reductions require authorized staff approval.</p><Link href="/contact#enquiry" className="inline-flex rounded-xl bg-primary text-on-primary px-6 py-3 font-semibold">Fees enquiries</Link></div><PublicAccordion items={[
    {id:"parent-pay",question:"Do parents need a separate dashboard?",answer:"No. Parents make payments through their child’s Student account. Edvora has two workspaces: Staff and Student."},
    {id:"pending",question:"What if checkout closes before confirmation?",answer:"Return to the Student portal and check the payment status. Verification must complete before a payment is credited. Contact the school with the reference if the status remains unresolved."},
    {id:"results",question:"Does an unpaid balance block published results?",answer:"No. Published results remain accessible in the Student portal regardless of the fee balance."},
    {id:"access",question:"How do I get account access?",answer:"The school verifies the guardian’s identity and issues a private password setup link. Use the pupil’s admission number and chosen password to sign in."},
   ]} /></div></section>
  </main><PublicFooter />
 </div>;
}
