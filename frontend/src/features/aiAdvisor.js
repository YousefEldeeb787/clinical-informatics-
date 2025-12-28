// src/features/aiAdvisor.js
export async function getAIDrugAdvice(patient, drug) {
  const notes = [];

  // 🧠 Simple smart analysis (for prototype use)

  // Penicillin allergy
  if (/amoxicillin|penicillin/i.test(drug.name) && patient.allergies?.some(a => /penicillin/i.test(a))) {
    notes.push("🚨 Important warning: The patient is allergic to penicillin. Avoid Amoxicillin and suggest a non–beta-lactam alternative.");
  }

  // Asthma + Beta-blockers
  if (/propranolol|metoprolol|carvedilol|atenolol/i.test(drug.name) &&
    patient.conditions?.some(c => /asthma/i.test(c))) {
    notes.push("⚠️ Caution: Beta-blockers may cause airway constriction in patients with asthma. Use a cardio-selective alternative or reassess treatment choice.");
  }

  // Hypertension + NSAIDs
  if (/ibuprofen|naproxen|diclofenac/i.test(drug.name) &&
    patient.conditions?.some(c => /hypertension/i.test(c))) {
    notes.push("💊 Note: NSAIDs can elevate blood pressure and impair kidney function. Monitor BP and renal status or use a safer pain reliever such as acetaminophen.");
  }

  // ACE inhibitors + Potassium / Spironolactone
  if (/lisinopril|enalapril|ramipril/i.test(drug.name) &&
    patient.currentMeds?.some(m => /spironolactone|potassium/i.test(m))) {
    notes.push("⚡ Warning: Combining ACE inhibitors with potassium-elevating drugs may cause hyperkalemia. Monitor serum potassium levels closely.");
  }

  // Age + Sedatives
  if (/diazepam|lorazepam|alprazolam/i.test(drug.name) && patient.age > 35) {
    notes.push("🧓 Advisory: Benzodiazepine sedatives increase the risk of falls and confusion in elderly patients. Use the lowest effective dose or consider safer alternatives.");
  }

  // Default message (no critical alerts)
  if (notes.length === 0) {
    return `✅ No critical alerts detected for ${drug.name} (${drug.dose}) based on age, conditions, and current medications.
It is advised to review dosage, kidney/liver function, and allergy history before dispensing.`;
  }

  return notes.join(" ");
}
