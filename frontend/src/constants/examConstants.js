export const EXAM_TYPES = [
    {
        value: "SERIES_TEST",
        label: "Series Test",
    },
    {
        value: "MODEL_EXAM",
        label: "Model Exam",
    },
    {
        value: "UNIVERSITY_EXAM",
        label: "University Exam",
    },
];

export const getExamTypeLabel = (value) => {
    const type = EXAM_TYPES.find((t) => t.value === value);
    if (type) return type.label;
    
    // Fallback for old formatting or unknown values
    if (!value) return "Exam";
    return value.replace(/([A-Z])/g, " $1").trim();
};

export const EXAM_STATUS = [
    {
        value: "SCHEDULED",
        label: "Scheduled",
    },
    {
        value: "RESCHEDULED",
        label: "Rescheduled",
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
    },
];