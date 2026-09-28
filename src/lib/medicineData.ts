export interface MedicineDetail {
  name: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  uses: string[];
  howItWorks: string;
  commonSideEffects: string[];
  seriousSideEffects: string[];
  warnings: string[];
  dosageNotes: string;
  foodInteractions: string[];
  interactions: string[];
  storage: string;
  sources: { label: string; url: string }[];
}

export const MEDICINE_DB: Record<string, MedicineDetail> = {
  metformin: {
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza', 'Riomet'],
    drugClass: 'Biguanide / Antidiabetic',
    uses: [
      'Type 2 diabetes mellitus management',
      'Reduces hepatic (liver) glucose production',
      'Improves peripheral insulin sensitivity',
      'Off-label: Polycystic ovary syndrome (PCOS)',
      'Off-label: Prediabetes prevention',
    ],
    howItWorks:
      'Metformin decreases liver glucose production and intestinal glucose absorption while improving insulin sensitivity by increasing peripheral glucose uptake and utilization.',
    commonSideEffects: [
      'Nausea and vomiting (especially at initiation)',
      'Diarrhea or stomach upset',
      'Metallic taste in the mouth',
      'Loss of appetite',
      'Headache',
    ],
    seriousSideEffects: [
      'Lactic acidosis (rare but serious — seek emergency care if you feel extreme weakness, slow or irregular heartbeat, or have trouble breathing)',
      'Vitamin B12 deficiency with long-term use (monitor levels annually)',
      'Hypoglycemia when combined with insulin or sulfonylureas',
    ],
    warnings: [
      'Do not use in kidney disease (eGFR < 30 mL/min)',
      'Hold for 48 hours before and after iodinated contrast dye procedures',
      'Alcohol significantly increases lactic acidosis risk',
      'Do NOT stop suddenly without consulting your doctor — blood sugar may spike',
    ],
    dosageNotes:
      'Typically started at 500 mg twice daily with meals. Dose may be gradually increased up to 2,550 mg/day in divided doses based on response and tolerance.',
    foodInteractions: [
      'Always take with food to reduce gastrointestinal side effects',
      'Avoid excessive alcohol — increases risk of dangerous lactic acidosis',
    ],
    interactions: [
      'Alcohol — increases risk of lactic acidosis',
      'Iodinated contrast dyes — hold metformin before and 48 h after procedure',
      'Diuretics and NSAIDs — can impair kidney function, raising metformin levels',
      'Fluoroquinolone antibiotics — may cause blood sugar fluctuations',
    ],
    storage: 'Store at room temperature 20–25°C (68–77°F). Keep away from moisture and heat.',
    sources: [
      { label: 'FDA Drug Label — Metformin HCl', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/020357s037,021202s021lbl.pdf' },
      { label: 'NIH MedlinePlus — Metformin', url: 'https://medlineplus.gov/druginfo/meds/a696005.html' },
      { label: 'Mayo Clinic — Metformin', url: 'https://www.mayoclinic.org/drugs-supplements/metformin-oral-route/description/drg-20067074' },
    ],
  },

  amlodipine: {
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    brandNames: ['Norvasc', 'Katerzia'],
    drugClass: 'Calcium Channel Blocker / Antihypertensive',
    uses: [
      'Hypertension (high blood pressure)',
      'Stable angina (chest pain on exertion)',
      'Vasospastic angina (Prinzmetal angina)',
      'Coronary artery disease management',
    ],
    howItWorks:
      'Amlodipine blocks L-type calcium channels in vascular smooth muscle, relaxing blood vessels and reducing cardiac workload — thereby lowering blood pressure.',
    commonSideEffects: [
      'Peripheral edema (ankle/feet swelling)',
      'Fatigue or tiredness',
      'Flushing (warm, red, tingling skin)',
      'Palpitations (fast or irregular heartbeat)',
      'Dizziness or lightheadedness',
      'Stomach pain or nausea',
    ],
    seriousSideEffects: [
      'Severe low blood pressure (hypotension) — especially with first dose',
      'Worsening chest pain or angina at start of treatment',
      'Exacerbation of heart failure in susceptible patients',
    ],
    warnings: [
      'Do not stop abruptly — may trigger rebound angina',
      'Use with caution in severe aortic stenosis',
      'Monitor blood pressure and heart rate regularly',
      'Do NOT increase or stop dose without consulting your doctor',
    ],
    dosageNotes:
      'Usual dose is 5–10 mg once daily. Elderly patients typically start at 2.5 mg. Takes 7–8 days to reach steady-state blood levels.',
    foodInteractions: [
      'Avoid grapefruit and grapefruit juice — inhibits metabolism and significantly increases drug blood levels',
    ],
    interactions: [
      'Simvastatin — amlodipine raises simvastatin levels; limit simvastatin to 20 mg/day',
      'Strong CYP3A4 inhibitors (erythromycin, itraconazole) — increase amlodipine levels',
      'Cyclosporine — immunosuppressant levels may be affected',
      'Grapefruit juice — inhibits CYP3A4 metabolism',
    ],
    storage: 'Store at 15–30°C (59–86°F). Protect from light and moisture.',
    sources: [
      { label: 'FDA Drug Label — Amlodipine (Norvasc)', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2011/019787s038lbl.pdf' },
      { label: 'NIH MedlinePlus — Amlodipine', url: 'https://medlineplus.gov/druginfo/meds/a692044.html' },
      { label: 'Mayo Clinic — Amlodipine', url: 'https://www.mayoclinic.org/drugs-supplements/amlodipine-oral-route/description/drg-20061784' },
    ],
  },

  'vitamin d3': {
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    brandNames: ['Nature Made D3', 'NatureBell D3', 'NOW D3', 'Solgar D3'],
    drugClass: 'Fat-Soluble Vitamin / Dietary Supplement',
    uses: [
      'Treatment and prevention of Vitamin D deficiency',
      'Bone health and osteoporosis prevention',
      'Calcium and phosphate absorption support',
      'Immune system modulation',
      'Muscle function and neuromuscular support',
    ],
    howItWorks:
      'Cholecalciferol is converted in the liver to calcidiol and then in the kidneys to calcitriol, which regulates calcium and phosphate absorption, bone mineralization, and immune cell function.',
    commonSideEffects: [
      'Generally very well tolerated at recommended doses',
      'Nausea or upset stomach at high doses',
      'Constipation',
    ],
    seriousSideEffects: [
      'Vitamin D toxicity / hypercalcemia with very high prolonged doses: confusion, weakness, frequent urination, kidney stones',
      'Hypercalciuria (excess calcium in urine) leading to kidney damage',
    ],
    warnings: [
      'Do not exceed 4,000 IU/day without medical supervision',
      'Toxicity risk is higher than water-soluble vitamins — fat-soluble vitamins accumulate in body fat',
      'Monitor blood calcium levels during high-dose therapy',
      'Consult your doctor before changing your dose',
    ],
    dosageNotes:
      'Typical supplementation: 1,000–2,000 IU daily for maintenance. Therapeutic doses for confirmed deficiency (25-OH D < 20 ng/mL) may reach 50,000 IU/week under physician guidance.',
    foodInteractions: [
      'Take with a fat-containing meal for optimal absorption (fat-soluble vitamin)',
      'Adequate magnesium intake supports vitamin D activation in the body',
    ],
    interactions: [
      'Thiazide diuretics — may cause hypercalcemia when combined',
      'Digoxin — hypercalcemia from excess D3 can worsen digoxin toxicity',
      'Corticosteroids — reduce vitamin D absorption',
      'Orlistat and cholestyramine — significantly reduce D3 absorption',
    ],
    storage: 'Store at room temperature, away from direct sunlight and moisture. Do not freeze gel-caps.',
    sources: [
      { label: 'NIH Office of Dietary Supplements — Vitamin D', url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/' },
      { label: 'NIH MedlinePlus — Cholecalciferol', url: 'https://medlineplus.gov/druginfo/meds/a611046.html' },
      { label: 'Mayo Clinic — Vitamin D', url: 'https://www.mayoclinic.org/drugs-supplements-vitamin-d/art-20363792' },
    ],
  },

  atorvastatin: {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    brandNames: ['Lipitor'],
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin) / Antilipemic',
    uses: [
      'Hyperlipidemia (high cholesterol)',
      'Primary prevention of cardiovascular disease in high-risk patients',
      'Secondary prevention in patients with known CVD',
      'Reduces LDL ("bad") cholesterol and triglycerides',
      'Familial hypercholesterolemia',
    ],
    howItWorks:
      'Atorvastatin inhibits HMG-CoA reductase, the rate-limiting enzyme in hepatic cholesterol biosynthesis, reducing circulating LDL cholesterol and overall cardiovascular risk.',
    commonSideEffects: [
      'Muscle pain or weakness (myalgia) — most common reason for discontinuation',
      'Headache',
      'Nausea, diarrhea, or constipation',
      'Mildly elevated liver enzymes (usually asymptomatic and reversible)',
      'Joint pain',
    ],
    seriousSideEffects: [
      'Rhabdomyolysis — severe muscle breakdown: seek urgent care for extreme muscle pain or dark/cola-colored urine',
      'Liver injury (rare): watch for jaundice, dark urine, or right upper abdominal pain',
      'New-onset type 2 diabetes mellitus (modest risk increase)',
    ],
    warnings: [
      'Do NOT use during pregnancy or breastfeeding',
      'Report any unexplained muscle pain, weakness, or dark urine to your doctor immediately',
      'Do not stop without consulting doctor — stopping abruptly increases cardiovascular event risk',
      'Avoid grapefruit juice — raises drug levels significantly',
    ],
    dosageNotes:
      'Usual starting dose is 10–20 mg once daily. High-intensity dosing (40–80 mg) for high cardiovascular risk. Can be taken at any time of day with or without food.',
    foodInteractions: [
      'Avoid grapefruit and grapefruit juice — inhibits metabolism and significantly increases drug levels',
    ],
    interactions: [
      'Cyclosporine, clarithromycin, itraconazole — dramatically increase atorvastatin levels; avoid or dose-reduce',
      'Colchicine — combination increases risk of muscle problems',
      'Amlodipine — raises atorvastatin levels by ~18%',
      'Grapefruit juice — inhibits CYP3A4 metabolism',
    ],
    storage: 'Store at 20–25°C (68–77°F). Keep in original container, away from moisture.',
    sources: [
      { label: 'FDA Drug Label — Atorvastatin (Lipitor)', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2009/020702s056lbl.pdf' },
      { label: 'NIH MedlinePlus — Atorvastatin', url: 'https://medlineplus.gov/druginfo/meds/a600045.html' },
      { label: 'Mayo Clinic — Atorvastatin', url: 'https://www.mayoclinic.org/drugs-supplements/atorvastatin-oral-route/description/drg-20067512' },
    ],
  },

  lisinopril: {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril'],
    drugClass: 'ACE Inhibitor / Antihypertensive',
    uses: [
      'Hypertension (high blood pressure)',
      'Heart failure — reduces hospitalizations and mortality',
      'Diabetic nephropathy — slows kidney disease progression',
      'Post-myocardial infarction (heart attack) treatment',
    ],
    howItWorks:
      'Lisinopril inhibits angiotensin-converting enzyme (ACE), blocking production of angiotensin II — a potent vasoconstrictor — relaxing blood vessels and lowering blood pressure.',
    commonSideEffects: [
      'Dry, persistent cough (affects ~10–15% of patients)',
      'Dizziness, especially when standing up quickly (orthostatic hypotension)',
      'Fatigue',
      'Headache',
      'Elevated blood potassium (hyperkalemia)',
    ],
    seriousSideEffects: [
      'Angioedema — sudden swelling of face, lips, tongue, or throat: seek emergency care immediately',
      'Acute kidney injury — especially with concurrent NSAID or diuretic use',
      'Severe first-dose hypotension (low blood pressure)',
      'Dangerous hyperkalemia (high potassium levels)',
    ],
    warnings: [
      'NEVER use during pregnancy — causes serious fetal harm or death',
      'Stop immediately and seek emergency care for throat or face swelling',
      'Avoid potassium supplements or salt substitutes unless directed by doctor',
      'Do NOT stop or change dose without consulting your doctor',
    ],
    dosageNotes:
      'Typically started at 5–10 mg once daily for hypertension, 2.5–5 mg for heart failure. Dose adjusted based on blood pressure response and kidney function.',
    foodInteractions: [
      'Avoid potassium-rich salt substitutes (contain KCl) — raises potassium to dangerous levels',
      'Alcohol can enhance blood pressure lowering effect — use caution',
    ],
    interactions: [
      'Potassium supplements or spironolactone — risk of dangerous hyperkalemia',
      'NSAIDs (ibuprofen, naproxen) — reduce antihypertensive effect and harm kidneys',
      'Lithium — ACE inhibitors can elevate lithium to toxic levels',
      'Aliskiren in diabetes — combination is contraindicated due to renal risk',
    ],
    storage: 'Store at 20–25°C (68–77°F), away from moisture and heat.',
    sources: [
      { label: 'FDA Drug Label — Lisinopril', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2014/019777s063lbl.pdf' },
      { label: 'NIH MedlinePlus — Lisinopril', url: 'https://medlineplus.gov/druginfo/meds/a692051.html' },
      { label: 'Mayo Clinic — Lisinopril', url: 'https://www.mayoclinic.org/drugs-supplements/lisinopril-oral-route/description/drg-20069129' },
    ],
  },

  omeprazole: {
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Prilosec OTC', 'Losec'],
    drugClass: 'Proton Pump Inhibitor (PPI) / Antiulcer',
    uses: [
      'Gastroesophageal reflux disease (GERD / acid reflux)',
      'Peptic ulcer disease (gastric and duodenal ulcers)',
      'H. pylori eradication as part of combination therapy',
      'Zollinger-Ellison syndrome (gastric acid hypersecretion)',
      'Erosive esophagitis',
    ],
    howItWorks:
      'Omeprazole irreversibly inhibits the H+/K+ ATPase proton pump in gastric parietal cells, blocking the final step of acid production and reducing gastric acid output by up to 95%.',
    commonSideEffects: [
      'Headache',
      'Diarrhea or constipation',
      'Nausea or stomach pain',
      'Flatulence and abdominal discomfort',
      'Vitamin B12 deficiency with long-term use',
    ],
    seriousSideEffects: [
      'Clostridium difficile infection — persistent diarrhea with long-term use',
      'Acute kidney injury or interstitial nephritis (rare)',
      'Increased fracture risk (hip, wrist, spine) with long-term high-dose use',
      'Severe hypomagnesemia causing tetany, seizures, or arrhythmia (rare)',
    ],
    warnings: [
      'Long-term use (> 1 year) requires medical justification and periodic review',
      'May mask symptoms of gastric cancer — ensure underlying cause is investigated',
      'Do NOT use with clopidogrel (Plavix) — reduces its antiplatelet effectiveness',
      'Do not stop suddenly if treating severe GERD or ulcers without medical advice',
    ],
    dosageNotes:
      'Standard dose: 20 mg once daily, taken 30–60 minutes before the first meal. Short-course treatment (4–8 weeks) is typical for most indications.',
    foodInteractions: [
      'Take 30–60 minutes before eating for optimal absorption and efficacy',
    ],
    interactions: [
      'Clopidogrel (Plavix) — significantly reduces its antiplatelet effect',
      'Methotrexate — PPIs can elevate methotrexate to potentially toxic levels',
      'Atazanavir and nelfinavir (HIV medications) — avoid combination',
      'Digoxin and iron supplements — absorption may be reduced',
    ],
    storage: 'Store at 15–30°C (59–86°F). Keep capsules in original packaging to protect from moisture.',
    sources: [
      { label: 'FDA Drug Label — Omeprazole (Prilosec)', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2012/019810s103,019810s104lbl.pdf' },
      { label: 'NIH MedlinePlus — Omeprazole', url: 'https://medlineplus.gov/druginfo/meds/a693050.html' },
      { label: 'Mayo Clinic — Omeprazole', url: 'https://www.mayoclinic.org/drugs-supplements/omeprazole-oral-route/description/drg-20068310' },
    ],
  },

  aspirin: {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid (ASA)',
    brandNames: ['Bayer', 'Ecotrin', 'Bufferin', 'Aspro'],
    drugClass: 'NSAID / Antiplatelet Agent / Antipyretic',
    uses: [
      'Mild to moderate pain relief',
      'Fever reduction',
      'Anti-inflammatory treatment',
      'Antiplatelet therapy for cardiovascular disease prevention',
      'Secondary prevention of heart attack and ischemic stroke',
    ],
    howItWorks:
      'Irreversibly inhibits COX-1 and COX-2 enzymes, reducing prostaglandin synthesis (pain and fever) and thromboxane A₂ production (platelet aggregation) for the platelet\'s entire lifespan (~7–10 days).',
    commonSideEffects: [
      'Stomach irritation, heartburn, or nausea',
      'Increased bleeding tendency',
      'Tinnitus (ringing in ears) at high doses',
    ],
    seriousSideEffects: [
      'Gastrointestinal bleeding or peptic ulcers',
      'Aspirin-exacerbated respiratory disease (asthma/bronchospasm in sensitive individuals)',
      "Reye's syndrome in children with viral illness — can be fatal",
      'Serious prolonged bleeding after injury or surgery',
    ],
    warnings: [
      'Do NOT give to children or teenagers with flu, chickenpox, or viral illness — risk of Reye\'s syndrome',
      'Stop at least 7 days before elective surgery (increases bleeding risk)',
      'Use caution with a history of stomach ulcers or GI bleeding',
      'Low-dose antiplatelet therapy must not be stopped without medical advice — stroke/heart attack risk',
    ],
    dosageNotes:
      'Pain/fever: 325–650 mg every 4–6 hours as needed (max 4 g/day). Antiplatelet (cardiovascular): 75–100 mg once daily. Always use the lowest effective dose.',
    foodInteractions: [
      'Take with food, milk, or antacids to minimize stomach irritation',
      'Alcohol significantly increases bleeding risk — avoid',
    ],
    interactions: [
      'Warfarin and other anticoagulants — significantly increased bleeding risk',
      'Ibuprofen — may block aspirin\'s antiplatelet effect if taken before aspirin',
      'Methotrexate — aspirin can raise methotrexate levels to toxic range',
      'ACE inhibitors — high-dose aspirin may reduce their blood pressure benefit',
    ],
    storage: 'Store at room temperature in a dry place. Discard if tablets smell of vinegar (acetic acid).',
    sources: [
      { label: 'FDA — Aspirin Information', url: 'https://www.fda.gov/drugs/postmarket-drug-safety-information-patients-and-providers/aspirin-information' },
      { label: 'NIH MedlinePlus — Aspirin', url: 'https://medlineplus.gov/druginfo/meds/a682878.html' },
      { label: 'Mayo Clinic — Aspirin', url: 'https://www.mayoclinic.org/drugs-supplements/aspirin-oral-route/description/drg-20068971' },
    ],
  },
};

export function getMedicineInfo(name: string): MedicineDetail | null {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();
  if (MEDICINE_DB[normalized]) return MEDICINE_DB[normalized];
  const firstWord = normalized.split(' ')[0];
  if (MEDICINE_DB[firstWord]) return MEDICINE_DB[firstWord];
  const found = Object.keys(MEDICINE_DB).find(k => normalized.includes(k) || k.includes(firstWord));
  return found ? MEDICINE_DB[found] : null;
}
