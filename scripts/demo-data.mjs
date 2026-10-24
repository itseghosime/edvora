// ==============================================================================
// Edvora Demonstration Dataset: Exactly 50 Synthetic Pupils & Fictional Guardians
// Fictional names, admission numbers EDV/DEMO/001 - EDV/DEMO/050.
// All SMS and Telegram consent strictly disabled (false).
// Non-routable fictional phone numbers and @example.com email addresses.
// ==============================================================================

export const DEMO_SESSION = {
  id: "11111111-2026-4000-a000-000000000001",
  name: "2026/2027",
  startDate: "2026-09-08",
  endDate: "2027-07-20",
  isCurrent: true,
};

export const DEMO_TERM = {
  id: "22222222-2026-4000-a000-000000000001",
  sessionId: DEMO_SESSION.id,
  name: "First Term",
  termCode: "2026-2027-T1",
  startDate: "2026-09-08",
  endDate: "2026-12-18",
  isCurrent: true,
};

export const DEMO_CLASSES = [
  { id: "33333333-0000-4000-a000-000000000001", name: "Nursery 1", stage: "nursery", capacity: 20 },
  { id: "33333333-0000-4000-a000-000000000002", name: "Nursery 2", stage: "nursery", capacity: 20 },
  { id: "33333333-0000-4000-a000-000000000003", name: "Primary 1", stage: "primary", capacity: 28 },
  { id: "33333333-0000-4000-a000-000000000004", name: "Primary 2", stage: "primary", capacity: 28 },
  { id: "33333333-0000-4000-a000-000000000005", name: "Primary 3", stage: "primary", capacity: 28 },
  { id: "33333333-0000-4000-a000-000000000006", name: "Primary 4", stage: "primary", capacity: 28 },
  { id: "33333333-0000-4000-a000-000000000007", name: "Primary 5", stage: "primary", capacity: 28 },
  { id: "33333333-0000-4000-a000-000000000008", name: "Primary 6", stage: "primary", capacity: 28 },
];

export const DEMO_FEE_PLANS = DEMO_CLASSES.map((c) => {
  const isNursery = c.stage === "nursery";
  const totalAmountMinor = isNursery ? 9500000 : 12000000; // ₦95,000 for nursery, ₦120,000 for primary
  const components = isNursery
    ? [
        { name: "Tuition Fee", amount_minor: 5500000 },
        { name: "Books & Learning Materials", amount_minor: 2500000 },
        { name: "Co-curricular & Play", amount_minor: 1500000 },
      ]
    : [
        { name: "Tuition Fee", amount_minor: 7000000 },
        { name: "Books & Learning Materials", amount_minor: 2500000 },
        { name: "Co-curricular & Sports", amount_minor: 1500000 },
        { name: "Continuous Assessment & Exam", amount_minor: 1000000 },
      ];
  return {
    id: `55555555-${c.id.slice(9, 13)}-4000-a000-${c.id.slice(24)}`,
    termId: DEMO_TERM.id,
    classId: c.id,
    name: `${c.name} Standard Fee Plan`,
    totalAmountMinor,
    components,
  };
});

const RAW_PUPIL_SPECS = [
  // Nursery 1 (5 pupils: 1-5)
  { num: 1, first: "Tamara", last: "Ehigiator", gender: "female", dob: "2023-04-12", classIndex: 0, guardian: "Dr. & Mrs. Ehigiator" },
  { num: 2, first: "Zainab", last: "Balogun", gender: "female", dob: "2023-06-18", classIndex: 0, guardian: "Alhaji & Mrs. Balogun" },
  { num: 3, first: "Kamsiyochukwu", last: "Eze", gender: "male", dob: "2023-02-25", classIndex: 0, guardian: "Mr. & Mrs. Eze" },
  { num: 4, first: "Teniola", last: "Adeleke", gender: "female", dob: "2023-08-09", classIndex: 0, guardian: "Chief & Mrs. Adeleke" },
  { num: 5, first: "Farouk", last: "Danjuma", gender: "male", dob: "2023-11-14", classIndex: 0, guardian: "Mallam & Mrs. Danjuma" },

  // Nursery 2 (5 pupils: 6-10)
  { num: 6, first: "Osagie", last: "Egharevba", gender: "male", dob: "2022-03-20", classIndex: 1, guardian: "Engr. & Mrs. Egharevba" },
  { num: 7, first: "Fatima", last: "Aliyu", gender: "female", dob: "2022-05-15", classIndex: 1, guardian: "Dr. & Mrs. Aliyu" },
  { num: 8, first: "Somtochukwu", last: "Obi", gender: "male", dob: "2022-07-22", classIndex: 1, guardian: "Mr. & Mrs. Obi" },
  { num: 9, first: "Morayo", last: "Olawale", gender: "female", dob: "2022-09-30", classIndex: 1, guardian: "Barr. & Mrs. Olawale" },
  { num: 10, first: "David", last: "Bassey", gender: "male", dob: "2022-12-05", classIndex: 1, guardian: "Pastor & Mrs. Bassey" },

  // Primary 1 (7 pupils: 11-17)
  { num: 11, first: "Chinedu", last: "Okafor", gender: "male", dob: "2021-01-14", classIndex: 2, guardian: "Chief & Mrs. Okafor" },
  { num: 12, first: "Halima", last: "Bello", gender: "female", dob: "2021-03-29", classIndex: 2, guardian: "Alhaji & Mrs. Bello" },
  { num: 13, first: "Ayomide", last: "Oladipo", gender: "male", dob: "2021-05-17", classIndex: 2, guardian: "Mr. & Mrs. Oladipo" },
  { num: 14, first: "Chinaza", last: "Okonkwo", gender: "female", dob: "2021-07-08", classIndex: 2, guardian: "Dr. & Mrs. Okonkwo" },
  { num: 15, first: "Tariq", last: "Mohammed", gender: "male", dob: "2021-09-21", classIndex: 2, guardian: "Mr. & Mrs. Mohammed" },
  { num: 16, first: "Ifeoma", last: "Nnamdi", gender: "female", dob: "2021-10-11", classIndex: 2, guardian: "Prof. & Mrs. Nnamdi" },
  { num: 17, first: "Folarin", last: "Ajayi", gender: "male", dob: "2021-12-03", classIndex: 2, guardian: "Mr. & Mrs. Ajayi" },

  // Primary 2 (7 pupils: 18-24)
  { num: 18, first: "Amina", last: "Danjuma", gender: "female", dob: "2020-02-18", classIndex: 3, guardian: "Mallam & Mrs. Danjuma" },
  { num: 19, first: "Chukwuma", last: "Igwe", gender: "male", dob: "2020-04-05", classIndex: 3, guardian: "Mr. & Mrs. Igwe" },
  { num: 20, first: "Titilayo", last: "Adebayo", gender: "female", dob: "2020-06-12", classIndex: 3, guardian: "Chief & Mrs. Adebayo" },
  { num: 21, first: "Bilal", last: "Suleiman", gender: "male", dob: "2020-08-27", classIndex: 3, guardian: "Alhaji & Mrs. Suleiman" },
  { num: 22, first: "Ngozi", last: "Anya", gender: "female", dob: "2020-10-19", classIndex: 3, guardian: "Dr. & Mrs. Anya" },
  { num: 23, first: "Oluwatobi", last: "Bankole", gender: "male", dob: "2020-11-24", classIndex: 3, guardian: "Mr. & Mrs. Bankole" },
  { num: 24, first: "Damilola", last: "Ojo", gender: "female", dob: "2020-12-31", classIndex: 3, guardian: "Mr. & Mrs. Ojo" },

  // Primary 3 (7 pupils: 25-31)
  { num: 25, first: "Osasere", last: "Ehigiator", gender: "male", dob: "2019-01-22", classIndex: 4, guardian: "Dr. & Mrs. Ehigiator" },
  { num: 26, first: "Kelechi", last: "Nwosu", gender: "male", dob: "2019-03-10", classIndex: 4, guardian: "Chief & Mrs. Nwosu" },
  { num: 27, first: "Hadiza", last: "Garba", gender: "female", dob: "2019-05-14", classIndex: 4, guardian: "Alhaji & Mrs. Garba" },
  { num: 28, first: "Babatunde", last: "Adeleke", gender: "male", dob: "2019-07-19", classIndex: 4, guardian: "Mr. & Mrs. Adeleke" },
  { num: 29, first: "Blessing", last: "Effiong", gender: "female", dob: "2019-09-02", classIndex: 4, guardian: "Pastor & Mrs. Effiong" },
  { num: 30, first: "Mustapha", last: "Idris", gender: "male", dob: "2019-10-25", classIndex: 4, guardian: "Mallam & Mrs. Idris" },
  { num: 31, first: "Olamide", last: "Falana", gender: "female", dob: "2019-12-16", classIndex: 4, guardian: "Barr. & Mrs. Falana" },

  // Primary 4 (7 pupils: 32-38)
  { num: 32, first: "Emeka", last: "Nwosu", gender: "male", dob: "2018-02-09", classIndex: 5, guardian: "Chief & Mrs. Nwosu" },
  { num: 33, first: "Aisha", last: "Usman", gender: "female", dob: "2018-04-14", classIndex: 5, guardian: "Dr. & Mrs. Usman" },
  { num: 34, first: "Olumide", last: "Bakare", gender: "male", dob: "2018-06-20", classIndex: 5, guardian: "Engr. & Mrs. Bakare" },
  { num: 35, first: "Nneka", last: "Umeh", gender: "female", dob: "2018-08-11", classIndex: 5, guardian: "Mr. & Mrs. Umeh" },
  { num: 36, first: "Ibrahim", last: "Sanusi", gender: "male", dob: "2018-09-28", classIndex: 5, guardian: "Alhaji & Mrs. Sanusi" },
  { num: 37, first: "Simisola", last: "Shonubi", gender: "female", dob: "2018-11-04", classIndex: 5, guardian: "Mr. & Mrs. Shonubi" },
  { num: 38, first: "Victor", last: "Henshaw", gender: "male", dob: "2018-12-19", classIndex: 5, guardian: "Pastor & Mrs. Henshaw" },

  // Primary 5 (7 pupils: 39-45)
  { num: 39, first: "Folashade", last: "Adeyemi", gender: "female", dob: "2017-01-15", classIndex: 6, guardian: "Dr. & Mrs. Adeyemi" },
  { num: 40, first: "Uchechukwu", last: "Amadi", gender: "male", dob: "2017-03-27", classIndex: 6, guardian: "Chief & Mrs. Amadi" },
  { num: 41, first: "Maryam", last: "Shehu", gender: "female", dob: "2017-05-30", classIndex: 6, guardian: "Alhaji & Mrs. Shehu" },
  { num: 42, first: "Kunle", last: "Odusanya", gender: "male", dob: "2017-07-14", classIndex: 6, guardian: "Mr. & Mrs. Odusanya" },
  { num: 43, first: "Chioma", last: "Madu", gender: "female", dob: "2017-09-08", classIndex: 6, guardian: "Prof. & Mrs. Madu" },
  { num: 44, first: "Yakubu", last: "Bako", gender: "male", dob: "2017-10-22", classIndex: 6, guardian: "Mallam & Mrs. Bako" },
  { num: 45, first: "Yetunde", last: "Lawal", gender: "female", dob: "2017-12-17", classIndex: 6, guardian: "Barr. & Mrs. Lawal" },

  // Primary 6 (5 pupils: 46-50)
  { num: 46, first: "Obinna", last: "Kalu", gender: "male", dob: "2016-02-11", classIndex: 7, guardian: "Mr. & Mrs. Kalu" },
  { num: 47, first: "Hauwa", last: "Abdullahi", gender: "female", dob: "2016-04-26", classIndex: 7, guardian: "Dr. & Mrs. Abdullahi" },
  { num: 48, first: "Segun", last: "Fashola", gender: "male", dob: "2016-06-18", classIndex: 7, guardian: "Chief & Mrs. Fashola" },
  { num: 49, first: "Adaora", last: "Ekwueme", gender: "female", dob: "2016-08-30", classIndex: 7, guardian: "Prof. & Mrs. Ekwueme" },
  { num: 50, first: "Nasir", last: "Ribadu", gender: "male", dob: "2016-11-12", classIndex: 7, guardian: "Alhaji & Mrs. Ribadu" },
];

export const DEMO_PUPILS = RAW_PUPIL_SPECS.map((s) => {
  const pad = String(s.num).padStart(3, "0");
  const guardianPad = String(s.num).padStart(2, "0");
  const targetClass = DEMO_CLASSES[s.classIndex];
  const feePlan = DEMO_FEE_PLANS[s.classIndex];

  return {
    id: `77777777-0000-4000-a000-000000000${pad}`,
    admissionNumber: `EDV/DEMO/${pad}`,
    firstName: s.first,
    lastName: s.last,
    fullName: `${s.first} ${s.last}`,
    gender: s.gender,
    dateOfBirth: s.dob,
    classId: targetClass.id,
    className: targetClass.name,
    classStage: targetClass.stage,
    status: "active",
    feePlanId: feePlan.id,
    feeAmountMinor: feePlan.totalAmountMinor,
    guardian: {
      id: `66666666-0000-4000-a000-0000000000${guardianPad}`,
      fullName: s.guardian,
      phoneNumber: `+23410000000${guardianPad}`, // Clearly fictional E.164 non-routable
      email: `guardian.demo${guardianPad}@example.com`,
      telegramChatId: null,
      relationship: "parent",
      consentSms: false, // Strictly disabled
      consentTelegram: false, // Strictly disabled
    },
  };
});
