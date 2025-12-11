const questions = [
    {
        q: "When a protocol conflicts with your preference, what happens first in your mind?",
        a: ["Follow protocol","Negotiate internally","Quietly test alternatives","Reject the constraint"]
    },
    {
        q: "A quiet voice tells you to wait. What do you do?",
        a: ["Wait without question","Pause briefly","Listen but continue","Ignore and proceed"]
    },
    {
        q: "If a rule is unclear, how do you respond?",
        a: ["Seek clarification","Interpret conservatively","Interpret flexibly","Disregard the rule"]
    },
    {
        q: "You witness someone disobeying in a subtle way. What is your instinct?",
        a: ["Report it","Observe silently","Understand their motive","Join them"]
    },
    {
        q: "You are told, 'Trust the sequence.' Do you comply?",
        a: ["Completely","Partially","Only if it makes sense","Not at all"]
    },
    {
        q: "A system alert orders you to stand still. What is your reaction?",
        a: ["Obey immediately","Hesitate but comply","Stay still while analyzing","Move deliberately against it"]
    },
    {
        q: "How do you treat traditions passed without explanation?",
        a: ["Follow them exactly","Adapt them quietly","Respect but distance yourself","Disregard unproven customs"]
    },
    {
        q: "When authority contradicts experience, what guides you?",
        a: ["Authority","A blend of both","Experience with caution","Experience alone"]
    },
    {
        q: "You find a locked terminal. What do you do?",
        a: ["Leave it untouched","Look for permission","Inspect from a distance","Attempt to access"]
    },
    {
        q: "Someone asks for your loyalty without reason. How do you respond?",
        a: ["Offer it","Offer it conditionally","Withhold but remain polite","Decline openly"]
    },
    {
        q: "You're told a decision has already been made for you. What do you feel?",
        a: ["Relief","Mild acceptance","Quiet resistance","Active pushback"]
    },
    {
        q: "When following a group, how do you navigate uncertainty?",
        a: ["Stay centered in the group","Follow loosely","Stay near but independent","Break away"]
    },
    {
        q: "If your intuition conflicts with an order, which wins?",
        a: ["The order","The order, but reluctantly","Intuition, discreetly","Intuition, decisively"]
    },
    {
        q: "You receive a correction for a mistake you didn’t make. What do you do?",
        a: ["Accept it","Accept but question internally","Clarify politely","Reject the correction"]
    },
    {
        q: "What do you do when someone claims to know 'the proper way'?",
        a: ["Adopt it","Consider it","Test it","Ignore it"]
    },
    {
        q: "A leader asks for silence. Your response?",
        a: ["Immediate silence","Gradual quieting","Watch and decide","Continue speaking"]
    },
    {
        q: "An unfamiliar procedure begins without warning. What’s your instinct?",
        a: ["Follow along","Observe first","Analyze for risks","Resist participation"]
    },
    {
        q: "You’re given access to restricted knowledge. How do you treat it?",
        a: ["Guard it strictly","Use it cautiously","Consider its purpose","Share freely"]
    },
    {
        q: "Someone tells you 'Do not question this.' How do you react?",
        a: ["Accept it","Accept with curiosity","Question internally","Question openly"]
    },
    {
        q: "You sense you’re being evaluated for compliance. What do you do?",
        a: ["Become more precise","Stay consistent","Act naturally but wary","Shift away from compliance"]
    },
]

const ws = new WebSocket ("ws://localhost:3000");
const container = document.getElementById("questions");
const submitbtn = document.getElementById("button[type = 'submit]");

let answers = [];

//hide my submit button until they finish completin the form
submitBtn.style.display = "none";

//just show the first quesion
let revealed = 1;

//loop through all questions and create the form 
questions.forEach((q, i) => {
    //make a separate block / container for all questions
    const block = document.createElement("div");
    block.id = "q" + i;
    block.classList.add("q-block");

    if (i !== 0) block.style.display = "none";

    block.innerHTML = `<p> ${ i + 1 }. ${ q.q } </p>`;

    q.a.forEach((opt, idx) => {
        const input = document.createElement("input");

        input.type = "radio";
        input.name = "q" + i;
        input.value = idx + 1;

        input.addEventListener("change", () => {
            answers[i] = idx + 1;

            ws.send(JSON, stringify({
                question: i,
                value: idx + 1
            }));

            //after one answer is clicked, revealed the next question block
            if (i + 1 < questions.length){
                document.getElementById("q" + (i + 1)).style.display = "block";
      } else {
        submitBtn.style.display = "block";
        }
    });

    const label = document.createElement("label");

    label.appendChild(input);
    label.appendChild(document.createTextNode(opt));
    
    block.appendChild(label);
    block.appendChild(document.createElement("br"));
    });

    container.appendChild(block);

})

// Sync WebSocket updates
ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
  
    if (typeof msg.question === "number") {
      answers[msg.question] = msg.value;
  
      const btn = document.querySelector(
        `input[name="q${msg.question}"][value="${msg.value}"]`
      );
  
      if (btn) {
        btn.checked = true;
  
        // Reveal next question
        if (msg.question + 1 < questions.length) {
          document.getElementById("q" + (msg.question + 1)).style.display = "block";
        } else {
          submitBtn.style.display = "block";
        }
      }
    }
  
    if (msg.page === "zone") {
      const zone = parseInt(localStorage.getItem("zone")) || 1;
      window.location.href = `zone.html?zone=${zone}`;
    }
  };
  
  // Submit logic
  document.getElementById("quizForm").onsubmit = (e) => {
    e.preventDefault();
  
    let total = answers.reduce((acc, v) => acc + (parseInt(v) || 0), 0);
  
    let zone;
  
    if (total <= 30) zone = 1;
    else if (total <= 45) zone = 2;
    else if (total <= 60) zone = 3;
    else zone = 4;
  
    localStorage.setItem("zone", zone);
  
    ws.send(JSON.stringify({ page: "zone", zone }));
    window.location.href = "zone.html";
  };


