export const mockAssignments = [
  {
    id: 1,
    title: "Database Mini Project",
    subject: "Database Management Systems",
    description:
      "Design and implement a Library Management System using MySQL. Submit the source code, ER diagram and project report.",
    target_year: "2",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    max_marks: 100,
    attachment: "",
    created_by: "Dr. Rajesh Kumar (HOD)",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Operating System Case Study",
    subject: "Operating Systems",
    description:
      "Prepare a comparative study of Linux and Windows scheduling algorithms with suitable examples.",
    target_year: "3",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    max_marks: 50,
    attachment: "",
    created_by: "Dr. Rajesh Kumar (HOD)",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Computer Networks Assignment",
    subject: "Computer Networks",
    description:
      "Explain the OSI Model with neat diagrams and practical networking examples.",
    target_year: "2",
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    max_marks: 25,
    attachment: "",
    created_by: "Dr. Rajesh Kumar (HOD)",
    created_at: new Date().toISOString(),
  },
];