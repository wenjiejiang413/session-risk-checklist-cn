import { evaluate } from './evaluate.js';

const form = document.querySelector('[data-form]');
const progress = document.querySelector('[data-progress]');
const resultPanel = document.querySelector('[data-result]');

function optionMarkup(question, option) {
  return `<label><input type="radio" name="${question.id}" value="${option.value}"><span>${option.label}</span></label>`;
}

function renderChecklist(checklist) {
  const fields = checklist.questions.map((question, index) => `
    <fieldset>
      <legend>${String(index + 1).padStart(2, '0')}. ${question.question}</legend>
      <div class="options">${question.options.map((option) => optionMarkup(question, option)).join('')}</div>
    </fieldset>
  `).join('');

  form.innerHTML = `${fields}<div class="submit-row"><button type="submit" disabled>生成风险提示</button><button type="reset">重新填写</button></div>`;
  const submit = form.querySelector('[type="submit"]');

  const updateProgress = () => {
    const answered = new FormData(form);
    const count = [...answered.keys()].length;
    progress.textContent = `${count} / ${checklist.questions.length} 已回答`;
    submit.disabled = count !== checklist.questions.length;
  };

  form.addEventListener('change', updateProgress);
  form.addEventListener('reset', () => {
    window.setTimeout(updateProgress, 0);
    delete resultPanel.dataset.level;
    resultPanel.innerHTML = '<p class="section-label">RESULT</p><h2>结果会显示在这里</h2><p>回答全部问题后生成风险提示。低风险结果也不代表安全认证。</p>';
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const answers = Object.fromEntries(new FormData(form));
    const result = evaluate(checklist, answers);
    resultPanel.dataset.level = result.level;
    const notes = result.notes.length
      ? result.notes
      : ['未触发清单中的明显缺口，仍需核对实时规则、收款对象与账号实际状态'];
    resultPanel.innerHTML = `
      <span class="result-level">${result.level}</span>
      <h2>${result.title}</h2>
      <p>风险分数：${result.score}</p>
      <ul>${notes.map((note) => `<li>${note}</li>`).join('')}</ul>
      <p>${result.disclaimer}</p>
    `;
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  updateProgress();
}

try {
  const response = await fetch('./checklist.zh-CN.json');
  if (!response.ok) throw new Error(`规则加载失败：HTTP ${response.status}`);
  renderChecklist(await response.json());
} catch (error) {
  progress.textContent = '规则加载失败';
  form.innerHTML = `<p>无法加载核验规则。请刷新页面或在 GitHub 仓库中运行命令行版本。</p><p>${error.message}</p>`;
}
