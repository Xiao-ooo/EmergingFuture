const questions = [
    {
        q: "When a protocol brushes against your own instinct, what stirs in you first?",
        a: [
            ["A discreet testing of your own path", 3],
            ["A brief internal negotiation", 2],
            ["A soft refusal beneath the surface", 4],
            ["A quiet willingness to follow", 1]
        ]
    },
    {
        q: "A calm internal signal says: wait. How does your body respond?",
        a: [
            ["You keep moving but remain aware", 3],
            ["You continue as though you never heard it", 4],
            ["You settle into the pause", 1],
            ["You pause only for a moment", 2]
        ]
    },
    {
        q: "When a rule is handed to you without clarity, what forms your first step?",
        a: [
            ["You shape your own interpretation", 3],
            ["You let the ambiguity free you", 4],
            ["You follow it as stated", 1],
            ["You treat it cautiously", 2]
        ]
    },
    {
        q: "You observe someone bending a rule with precision. What draws forth your response?",
        a: [
            ["You mirror their deviation", 4],
            ["You try to understand the reasoning", 3],
            ["You watch without intervening", 2],
            ["You signal it upward", 1]
        ]
    },
    {
        q: "The system tells you: ‘Trust the sequence.’ Your mind answers with…",
        a: [
            ["A half-step of caution", 2],
            ["A silent detachment from the message", 4],
            ["A conditional acceptance", 3],
            ["A full surrender to the instruction", 1]
        ]
    },
    {
        q: "A system alert instructs you to hold still. What rises in you?",
        a: [
            ["A deliberate continuation of movement", 4],
            ["A slow, hesitant settling", 3],
            ["Immediate compliance", 1],
            ["A stillness edged with analysis", 2]
        ]
    },
    {
        q: "Traditions arrive without explanation. How does your mind treat them?",
        a: [
            ["You reshape them quietly", 3],
            ["You allow them to fade", 4],
            ["You keep them intact", 1],
            ["You respect them but remain apart", 2]
        ]
    },
    {
        q: "When authority speaks against what you’ve lived, what steadies you?",
        a: [
            ["A careful blend of both", 2],
            ["Authority’s weight", 1],
            ["Your own experience", 3],
            ["Experience, unfiltered", 4]
        ]
    },
    {
        q: "You encounter a locked terminal humming with restricted data. What do you do?",
        a: [
            ["Leave it untouched", 1],
            ["Seek rightful access", 2],
            ["Study it from a safe distance", 3],
            ["Test its boundaries", 4]
        ]
    },
    {
        q: "Someone asks for loyalty with no explanation. What forms your reply?",
        a: [
            ["A polite holding back", 2],
            ["A quiet refusal", 4],
            ["An unreserved offering", 1],
            ["A conditional agreement", 3]
        ]
    },
    {
        q: "You’re informed a choice has been made on your behalf. What brews within you?",
        a: [
            ["A muted resistance", 3],
            ["A steady pushback", 4],
            ["A gentle acceptance", 2],
            ["Relief at the certainty", 1]
        ]
    },
    {
        q: "When moving with a group through uncertainty, how do you place yourself?",
        a: [
            ["Centered within", 1],
            ["Near the edge, observing", 3],
            ["Close, but self-directed", 2],
            ["Separate from their path", 4]
        ]
    },
    {
        q: "Your intuition and an order collide. Which leads you?",
        a: [
            ["The order, without hesitation", 1],
            ["The order, though reluctantly", 2],
            ["Intuition, quietly", 3],
            ["Intuition, unmistakably", 4]
        ]
    },
    {
        q: "You’re corrected for an error you didn’t commit. What do you choose?",
        a: [
            ["A polite clarification", 3],
            ["A calm acceptance", 1],
            ["A clear refusal", 4],
            ["A silent acceptance with questions inside", 2]
        ]
    },
    {
        q: "Someone claims to know 'the proper way.' How does your reasoning move?",
        a: [
            ["You adopt it as offered", 1],
            ["You test it for yourself", 3],
            ["You consider it and hold it loosely", 2],
            ["You ignore the claim", 4]
        ]
    },
    {
        q: "A leader requests silence. How does your silence appear?",
        a: [
            ["An immediate stillness", 1],
            ["A watchful quiet", 2],
            ["A continued murmur", 4],
            ["A gradual dimming of your voice", 3]
        ]
    },
    {
        q: "An unfamiliar procedure starts without warning. What emerges within you?",
        a: [
            ["You resist its pull", 4],
            ["You fall in step", 1],
            ["You watch first", 2],
            ["You question its risks", 3]
        ]
    },
    {
        q: "You’re given access to something restricted. How do you guard it?",
        a: [
            ["You move carefully with it", 2],
            ["You protect it sharply", 1],
            ["You release it freely", 4],
            ["You weigh its purpose", 3]
        ]
    },
    {
        q: "Someone tells you not to question. Where does your mind go?",
        a: [
            ["You accept, but with curiosity beneath", 2],
            ["You honor the instruction", 1],
            ["You question internally", 3],
            ["You probe the boundary openly", 4]
        ]
    },
    {
        q: "You sense your compliance is being measured. How do you calibrate yourself?",
        a: [
            ["You stabilize your usual patterns", 2],
            ["You maintain your natural behavior", 3],
            ["You drift away from compliance", 4],
            ["You sharpen your precision", 1]
        ]
    }
];


const ws = new WebSocket ("wss://emergingfuture.onrender.com");
const container = document.getElementById("questions");
const submitbtn = document.getElementById("submitBtn");

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
        const text = opt[0];
        const val = opt[1];

        const input = document.createElement("input");

        input.type = "radio";
        input.name = "q" + i;
        input.value = val;

        input.addEventListener("change", () => {
            answers[i] = val;

            ws.send(JSON.stringify({
                question: i,
                value: val
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

// sends the action doned over to the other tab live tunnel
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
      //go get the saved zone number in local storage, and converted it to numbers by parseInt
      //convert the message of the zone number recieved in the correct format
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


