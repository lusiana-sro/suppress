import transformers
import json
import argparse
import base64 as b64
def main():
    # read user imput as flags when running the script
    # e.g. python suppress_py/huggingface.py --model_name_or_path bert-base-uncased
    # also get imput for the task and prompt
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, default=None)
    parser.add_argument("--task", type=str, default=None)
    parser.add_argument("--params", type=str, default="{}")
    args = parser.parse_args()
    model = args.model
    task = args.task
    params = json.loads(b64.b64decode(args.params).decode("utf-8"))
    pipe = transformers.pipeline(task=task, model=model)
    parl = list(params.values())
    res = pipe(*parl)
    try:
        print(json.dumps(res))
    except:
        print(res)

if __name__ == "__main__":
    main()
