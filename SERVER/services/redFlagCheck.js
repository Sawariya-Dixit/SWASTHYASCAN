const RED_FLAGS = ["chest_pain", "severe_breathlessness"];

function checkRedFlag(symptoms) {
  const matched = symptoms.filter((s) => RED_FLAGS.includes(s));
  if (matched.length > 0) {
    return {
      isUrgent: true,
      message:
        "This may be a medical emergency. Please seek immediate medical attention or call emergency services.",
      matchedSymptoms: matched,
    };
  }
  return { isUrgent: false };
}

module.exports = { checkRedFlag };
