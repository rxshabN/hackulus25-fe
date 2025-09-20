export const whitelist = [
  "rishab.nagwani2023@vitstudent.ac.in",
  "aryan.vinod2023@vitstudent.ac.in",
  "nainika.anish2023@vitstudent.ac.in",
  "simran.rawat2023@vitstudent.ac.in",
  "janakipillai.raghav2023@vitstudent.ac.in",
  "aaryan.shrivastav2023@vitstudent.ac.in",
  "hitakshi.sardana2023@vitstudent.ac.in",
  "suhani.singh2023@vitstudent.ac.in",
  "sriharshitha.2023@vitstudent.ac.in",
  "priyanshu.kumar2023@vitstudent.ac.in",
  "saanvi.devendra2023@vitstudent.ac.in",
  "akriti.agarwal2023@vitstudent.ac.in",
  "ruhirohit.adke2023@vitstudent.ac.in",
];

export const tracks = [
  {
    name: "AI and Mathematical Modelling",
    logo: "/ai.webp",
  },
  {
    name: "Cyber Security",
    logo: "/cybersec.webp",
  },
  {
    name: "FinTech",
    logo: "/fintech.webp",
  },
  {
    name: "Healthcare",
    logo: "/healthcare.webp",
  },
  {
    name: "VIT-Centric",
    logo: "/vitcentric.webp",
  },
  {
    name: "Open Innovation",
    logo: "/open.webp",
  },
  {
    name: "Sustainability",
    logo: "/sustainability.webp",
  },
];

export const trackinfo = [
  {
    name: "AI and Mathematical Modelling",
    description:
      "This track focuses on using artificial intelligence and mathematical models to create predictive and optimized systems that solve complex, real-world problems.",
    problem_statements: [
      {
        title: "Adaptive Fleet Rerouting in Congested Cities",
        info: "Delivery fleets operating in congested cities face delays due to unpredictable events like traffic jams or bad weather, causing increased fuel consumption and missed delivery windows. The solution should be an adaptive modelling framework that predicts disruptions and reroutes delivery fleets in real time, optimizing for fuel usage, time, and carbon emissions. It should incorporate real-time data inputs and re-compute efficient routes automatically without human intervention.",
      },
      {
        title: "Athlete Fatigue Prediction System",
        info: "Overtraining without proper monitoring leads to avoidable injuries in athletes due to a failure to detect mental and physical fatigue early. The solution should be a predictive analytics system that collects physiological, environmental, and historical performance data to forecast fatigue levels during training. The system should recommend rest periods or workload adjustments to prevent injuries, supporting real-time use by coaches and athletes.",
      },
    ],
  },
  {
    name: "Cyber Security",
    description:
      "This track is dedicated to addressing the challenges of cybersecurity in the digital age. Participants will work on identifying vulnerabilities, developing security protocols, and creating tools to protect data and systems from cyber threats.",
    problem_statements: [
      {
        title: "Zero-Touch Device Attestation in Smart Homes",
        info: "With the rapid increase of IoT devices in smart homes, such as cameras, smart locks, and sensors, there is a major risk that unauthorized or tampered devices may connect to the home network undetected, compromising security. The solution should be a protocol and system that ensures every IoT device joining the home network is automatically authenticated without requiring user action. It must ensure devices are tamper-proof, continuously verified, and instantly revocable if compromised, using only mechanical or lightweight cryptographic methods suitable for low-power devices.",
      },
      {
        title: "Deepfake Detection for Live Video Feeds",
        info: "Deepfake technology is advancing rapidly, enabling malicious actors to falsify live video feeds in real time, which is a huge concern in sensitive applications like surveillance, telemedicine, or virtual conferencing. The solution should be a system that detects deepfake manipulations in live video streams by analyzing multiple signals (audio, image inconsistencies, and metadata), ensuring ultra-low latency and minimal compute resources so that it works effectively on edge devices without cloud dependency.",
      },
    ],
  },
  {
    name: "FinTech",
    description:
      "This track explores the intersection of finance and technology, tasking participants with developing systems to enhance financial security and improve educational accessibility.",
    problem_statements: [
      {
        title: "Fraud Detection for Micro-Transactions",
        info: "Small financial transactions (UPI, micro-loans) are frequent targets for fraud, but traditional detection systems often overlook them due to their low value. The solution is to develop a fraud-prediction engine that uses behavioral biometrics (like typing speed) and transaction metadata to flag anomalous activities in real time, preventing losses while minimizing false positives.",
      },
      {
        title: "Finance Literacy Platform for Marginalized Youth",
        info: "Marginalized youth often lack access to financial literacy tools, leaving them vulnerable to poor money management and scams. The solution is to create an interactive, multilingual platform that gamifies learning about saving, borrowing, and investing using real-life local scenarios. It should provide adaptive feedback and peer-to-peer mentoring to help users improve their financial knowledge.",
      },
    ],
  },
  {
    name: "Healthcare",
    description:
      "This track challenges participants to create innovative healthcare solutions that leverage technology to assist medical professionals and promote proactive patient wellness.",
    problem_statements: [
      {
        title: "AI Knowledge Aggregator for Clinicians",
        info: "Clinicians face difficulty keeping up with the growing volume of medical research, guidelines, and clinical trials, leading to potential gaps in patient care. The solution is to build an AI-assisted tool that automatically aggregates and summarizes the latest research, guidelines, and trials relevant to a patient's profile. The system must rank recommendations by relevance and evidence level, enabling clinicians to make informed decisions faster.",
      },
      {
        title: "Mental Wellness Companion App",
        info: "Mental health crises often remain undetected until the condition is severe because early warning signs like changes in speech or behavior go unnoticed. The solution is to design a mental wellness app that monitors behavioral and speech patterns (with user consent), detects potential crises, and automatically connects users to mental health resources or emergency responders in real time to promote early intervention.",
      },
    ],
  },
  {
    name: "VIT-Centric",
    description:
      "This track focuses on enhancing the student experience at VIT by developing practical applications that streamline and improve various aspects of campus life.",
    problem_statements: [
      {
        title: "Student Engagement Dashboard",
        info: "At VIT, information about extracurricular clubs, projects, and team opportunities is scattered and hard for students to find. The solution is a smart dashboard that tracks each student's interests and activities to suggest relevant peer connections, events, or team opportunities, automating and enhancing both learning and social engagement.",
      },
      {
        title: "Campus Safety & Item Recovery App",
        info: "Lost items and campus safety concerns are often handled informally through group chats, which is inefficient and creates theft risks. The solution is an app where students can report lost items with images and geotags. The system would match them with found items, send security alerts, and provide a secure handover mechanism for safe recovery.",
      },
    ],
  },
  {
    name: "Open Innovation",
    description:
      "This track encourages participants to build collaborative, open-source platforms that empower communities to address broad societal challenges in a transparent manner.",
    problem_statements: [
      {
        title: "Citizen Environmental Hazard Reporting Platform",
        info: "Environmental hazards like pollution or waste dumps often go unreported or are not acted upon due to a lack of structured reporting and validation mechanisms. The solution is to build a platform where citizens can report hazards using images and geotags. Experts and volunteers would then validate the reports, and the system would generate open-source remediation plans to increase public accountability and action.",
      },
      {
        title: "Decentralized Academic Peer Review System",
        info: "Academic peer review is often slow, opaque, and biased, which delays the dissemination of knowledge. The solution is to design a decentralized system where researchers share preprints and receive structured, transparent feedback from global volunteers. This system should track versions, citations, and reviewer contributions to ensure a transparent and accountable review process.",
      },
      {
        title: "Open Innovation Challenge",
        info: "Identify any real-world problem or challenge you are passionate about and propose an innovative and feasible solution. This is your opportunity to showcase creativity and problem-solving skills.",
      },
    ],
  },
  {
    name: "Sustainability",
    description:
      "This track is dedicated to developing technological solutions for environmental challenges, focusing on creating platforms that promote resource efficiency and encourage sustainable habits.",
    problem_statements: [
      {
        title: "Micro-Logistics Network for Surplus Food",
        info: "Tons of surplus food go to waste daily while many households are in need, especially in urban areas. The solution is to design a micro-logistics platform connecting small food producers and restaurants with NGOs or needy households. The system should optimize just-in-time pickup and delivery to minimize spoilage and reduce the carbon footprint.",
      },
      {
        title: "Carbon Footprint Tracker with Local Swaps",
        info: "People often want to reduce their carbon footprint but lack real-time insights into the environmental impact of their daily actions. The solution is a platform that tracks carbon emissions from individual or community actions (like transport and diet) in real time, visualizes their impact, and suggests hyper-local sustainable swaps with social incentives to encourage behavior change.",
      },
    ],
  },
];
