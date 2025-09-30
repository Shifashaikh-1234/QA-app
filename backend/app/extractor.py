from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import base64
import openai
import json
import re
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")  # replace with your actual key

@app.post("/extract-items")
async def extract_items(filename: str, file: UploadFile = File(...)):
    try:
        with open(filename, "rb") as file:
            image_data = file.read()
            base64_image = base64.b64encode(image_data).decode("utf-8")

            response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract item descriptions and quantities from this image in JSON format. Use: [{\"item\": \"...\", \"quantity\": ...}]"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ]
        )

        content = response.choices[0].message.content.strip()
        clean_json = re.sub(r"```(?:json)?|```", "", content).strip()

        # Try parsing JSON
        result = json.loads(clean_json)
        return result

    except Exception as e:
        result=[]
        return result
