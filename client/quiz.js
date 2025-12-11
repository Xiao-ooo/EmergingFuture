const questions = [
    {
        q: "When a protocol conflicts with your preference, what happens first in your mind?",
        a: ["Follow protocol","Negotiate internally","Quietly test alternatives","Reject the constraint"]
    },
    {
        q: "A quiet voice tells you to wait. What do you do?",
        a: ["Wait without question","Pause briefly","Listen but continue","Ignore and proceed"]
    }
]

const ws = new WebSocket {"ws://localhost:3000"};
const container = document.getElementById("questions");
const submitbtn = document.getElementById("button[type = 'submit]");

let answers: [];

//just show the first quesion
let revealed = 1;

//hide my submit button until they finish completin the form
submitbtn.style.display = 'none';

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


