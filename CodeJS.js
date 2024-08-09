**************************************************************************************


 // Code to convert from voice to text.


 async function voice() {
            var recognition = new webkitSpeechRecognition();
            recognition.lang = "en-US";

            recognition.onresult = async function(event) {
                console.log(event);
                var transcript = event.results[0][0].transcript;
                document.getElementById("convert_text").value = transcript;
                await sendToChatbot(transcript);
            }

            recognition.start();
        }


**************************************************************************************


// Code to send to openai and reply with voice.


        async function sendToChatbot(message) {
            console.log("Sending message to chatbot:", message);
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions' // Here is the link to the model. As for this link, it is for model 4.
                    , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer your API key'// Here you put your API keys.
                    },
                    body: JSON.stringify({
                        model: 'gpt-4',
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: message }
                        ],
                        max_tokens: 150
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Chatbot response data:", data);
                if (!data.choices || data.choices.length === 0) {
                    throw new Error("Invalid response from API, no choices found.");
                }
                const chatbotResponse = data.choices[0].message.content.trim();
                speakResponse(chatbotResponse);
            } catch (error) {
                console.error('Error:', error);
                speakResponse("Sorry, I couldn't reach the chatbot service.");
            }
        }
**************************************************************************************


// Code to convert from text to voice.


        function speakResponse(response) {
            var utterance = new SpeechSynthesisUtterance(response);
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
            document.getElementById("chatbot_response").innerText = response;
        }

        document.getElementById("start-listening").addEventListener("click", voice); 