export const getQuestionCount = (examData: any): number => {
  if (!examData) return 0;
  if (Array.isArray(examData)) return examData.length;
  if (examData.sections && Array.isArray(examData.sections)) {
    return examData.sections.reduce((acc: number, sec: any) => {
      if (!Array.isArray(sec.questions)) return acc;
      return acc + sec.questions.reduce((qAcc: number, q: any) => {
        if (q.type === "tfng" && Array.isArray(q.statements)) {
          return qAcc + q.statements.length;
        }
        if (q.type === "matching-headings" && Array.isArray(q.paragraphs)) {
          return qAcc + q.paragraphs.length;
        }
        if (q.type === "gap-fill" && q.answers) {
          return qAcc + Object.keys(q.answers).length;
        }
        if (q.type === "mc-cloze" && Array.isArray(q.gaps)) {
          return qAcc + q.gaps.length;
        }
        return qAcc + 1;
      }, 0);
    }, 0);
  }
  return 0;
};

export const isAnswerCorrect = (userAns: string | undefined, correctAns: string, type: string) => {
  if (!userAns) return false;
  if (type === "dictation" || type === "gap-fill") {
    const clean = (str: string) => str.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").replace(/\s+/g, " ");
    return clean(userAns) === clean(correctAns);
  }
  return userAns.trim() === correctAns.trim();
};

export const playAudio = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};
