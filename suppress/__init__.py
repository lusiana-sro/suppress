import openai
import pandas as pd
import json as json
openai.api_key = "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"
def passQuery(query):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=query,
        temperature=0.7,
        max_tokens=700,
        top_p=1,
        frequency_penalty=0.4,
        presence_penalty=0.5
    )
    return response.choices[0].text


structure = '[{"type": "text", "text": "This is a text field"},...]'
def formatData(data):
    prompt = f"{data}\nUse the above data, and structure it according to the following format:\n{structure}\nStructured Data:"
    res = passQuery(prompt)
    return json.loads(res)


def generateData(params):
    prompt = f"Write {params['count']} sentences about {params['topic']}:"
    res = passQuery(prompt)
    return formatData(res)

if __name__ == "__main__":
    data=generateData({"topic": "Star Trek", "count": 4})
    print(data)
    # create a dataframe from the data
    df = pd.DataFrame(data)
    df.to_csv('data.csv', index=False)
    print(df)
