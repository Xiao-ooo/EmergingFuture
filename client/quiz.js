const questions = [
    {
        q: "When rules brush against your own impulses, what first rises within you?",
        a: ["Follow it quietly without thought", "Weigh it against your own sense", "Experiment in small ways", "Question and resist it internally"]
    },
    {
        q: "A silent signal urges patience. How does your mind respond?",
        a: ["Trust the pause and wait", "Hesitate briefly before acting", "Consider it but move forward", "Act as if it didn’t speak"]
    },
    {
        q: "Faced with a guideline shrouded in ambiguity, how do you navigate it?",
        a: ["Seek guidance and follow", "Interpret cautiously and stay safe", "Adapt it creatively", "Disregard it if inconvenient"]
    },
    {
        q: "You observe someone quietly bending an expectation. What stirs in you?",
        a: ["Note it and follow protocol", "Observe quietly without judgment", "Understand their reasoning", "Experiment with their approach"]
    },
    {
        q: "You are invited to trust a process you don’t fully see. What do you do?",
        a: ["Trust completely without question", "Proceed but with internal checks", "Follow only if it aligns with sense", "Suspend trust entirely"]
    },
    {
        q: "An alert asks you to stand still. How does your body and mind respond?",
        a: ["Comply at once", "Pause and comply cautiously", "Remain still while analyzing", "Move with deliberate disregard"]
    },
    {
        q: "Ancient patterns come without explanation. How do you engage with them?",
        a: ["Follow them as given", "Respectfully adapt them", "Observe but keep distance", "Let them fade naturally"]
    },
    {
        q: "When voices of authority contradict what you know, what guides your steps?",
        a: ["Defer to authority", "Balance authority with experience", "Rely cautiously on experience", "Trust experience alone"]
    },
    {
        q: "You encounter a locked, humming archive. How does curiosity move within you?",
        a: ["Leave it untouched", "Seek access properly", "Study it discreetly", "Probe its boundaries quietly"]
    },
    {
        q: "Someone asks for allegiance without reason. How do you respond internally?",
        a: ["Offer it without condition", "Offer cautiously and conditionally", "Politely withhold", "Decline firmly"]
    },
    {
        q: "A choice has been decided on your behalf. How do you experience it?",
        a: ["Relief in certainty", "Quiet acceptance", "Subtle resistance", "Internal defiance"]
    },
    {
        q: "Moving with a group through uncertainty, where do you place yourself?",
        a: ["Stay integrated and centered", "Follow loosely with awareness", "Stay nearby but self-directed", "Separate and explore independently"]
    },
    {
        q: "When inner instinct and an external command collide, which voice leads?",
        a: ["Follow the order immediately", "Follow but with hesitation", "Trust intuition quietly", "Trust intuition decisively"]
    },
    {
        q: "Corrected for an error you didn’t make, how does your mind settle?",
        a: ["Accept gracefully", "Accept but question internally", "Clarify politely", "Reject it firmly"]
    },
    {
        q: "Someone insists there is only one 'proper way.' How do you respond?",
        a: ["Adopt it with trust", "Consider it thoughtfully", "Test and explore it", "Ignore or reinterpret it"]
    },
    {
        q: "A call for silence is made. How does your presence shift?",
        a: ["Fall into silence immediately", "Gradually quiet yourself", "Observe and adjust", "Continue your own expression"]
    },
    {
        q: "A new procedure unfolds unexpectedly. What guides your first action?",
        a: ["Follow along cautiously", "Observe before acting", "Analyze potential risks", "Resist or modify it"]
    },
    {
        q: "Access is granted to knowledge few may hold. How do you move with it?",
        a: ["Guard it responsibly", "Use it carefully", "Reflect on its purpose", "Share selectively or freely"]
    },
    {
        q: "An instruction forbids questioning. What internal dialogue emerges?",
        a: ["Accept it fully", "Accept while pondering", "Consider it internally", "Probe and challenge openly"]
    },
    {
        q: "You sense your conformity is being observed. How does this shape your behavior?",
        a: ["Adjust subtly to expectations", "Maintain steady patterns", "Act naturally but cautiously", "Shift intentionally away from conformity"]
    }
];


const ws = new WebSocket("wss://emergingfuture.onrender.com");
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

    block.innerHTML = `<p> ${i + 1}. ${q.q} </p>`;

    q.a.forEach((opt, idx) => {
        const input = document.createElement("input");

        input.type = "radio";
        input.name = "q" + i;
        input.value = idx + 1;

        input.addEventListener("change", () => {
            answers[i] = idx + 1;

            ws.send(JSON.stringify({
                question: i,
                value: idx + 1
            }));

            //after one answer is clicked, revealed the next question block
            if (i + 1 < questions.length) {
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


