export function evaluate(checklist, answers) {
  if (!checklist || !Array.isArray(checklist.questions)) {
    throw new TypeError('A checklist with questions is required');
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw new TypeError('Answers must be an object');
  }

  let score = 0;
  let critical = false;
  const notes = [];
  const selections = [];

  for (const question of checklist.questions) {
    const answer = answers[question.id];
    const option = question.options.find((candidate) => candidate.value === answer);

    if (!option) {
      const allowed = question.options.map((candidate) => candidate.value).join(', ');
      throw new RangeError(`Invalid or missing answer for ${question.id}; expected one of: ${allowed}`);
    }

    score += option.weight;
    critical ||= option.critical === true;
    if (option.note) notes.push(option.note);
    selections.push({ question: question.id, answer: option.value, weight: option.weight });
  }

  const highThreshold = checklist.thresholds?.high ?? 9;
  const checkThreshold = checklist.thresholds?.check ?? 4;
  let level;
  let title;

  if (critical) {
    level = 'STOP';
    title = '立即停止，不要继续提交凭证或付款';
  } else if (score >= highThreshold) {
    level = 'HIGH_RISK';
    title = '高风险，先不要付款';
  } else if (score >= checkThreshold) {
    level = 'CHECK_FIRST';
    title = '信息不足，补充确认后再决定';
  } else {
    level = 'LOWER_RISK';
    title = '基础信息较完整，仍需独立核验';
  }

  return {
    level,
    title,
    score,
    critical,
    notes,
    selections,
    disclaimer: checklist.disclaimer,
  };
}
