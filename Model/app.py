import pandas as pd
from flask import Flask, jsonify, request
from joblib import load
#from flask_cors import CORS

model=load(open("./Prediction_Deases_final_1.joblib",'rb'))
model2=load(open("./Prediction_Deases_final_2.joblib",'rb'))
diabetes=load(open("./Diabetes_deases.joblib",'rb'))
heart=load(open("./Heart_deases.joblib",'rb'))

app=Flask(__name__)
app.url_map.strict_slashes = False
#CORS(app)

@app.route("/")
def home():
    return "<h2>Flask Vercel</h2>"

@app.route('/predict', methods=['POST'])
def predict():
    # get data
    data = request.get_json(force=True)

    # convert data into dataframe
    data.update((x, [y]) for x, y in data.items())
    data_df = pd.DataFrame.from_dict(data)

    # predictions
    result = model.predict(data_df)

    # send back to browser
    output = {'results': int(result[0])}

    # return data
    return jsonify(results=output)

@app.route('/multipredict', methods=['POST'])
def multipredict():
    # get data
    data = request.get_json(force=True)

    # convert data into dataframe
    data.update((x, [y]) for x, y in data.items())
    data_df = pd.DataFrame.from_dict(data)

    # predictions
    result = model2.predict(data_df)

    # send back to browser
    output = {
        'result1': int(result[0][0]),
        'result2': int(result[0][1]),
        'result3': int(result[0][2]),
              }
    df=pd.read_csv("traintest.csv")
    re=[]
    for i in range(133):
        if(data_df.iloc[0,i]==1 and df.iloc[int(result[0][0]),i+1]>0):
            re.append(int(result[0][0]))
            break
    for i in range(133):
        if(data_df.iloc[0,i]==1 and df.iloc[int(result[0][1]),i+1]>0):
            re.append(int(result[0][1]))
            break
    for i in range(133):
        if(data_df.iloc[0,i]==1 and df.iloc[int(result[0][2]),i+1]>0):
            re.append(int(result[0][2]))
            break
    
    print(set(re))


    # return data
    return jsonify(results=list(set(re)))

@app.route('/diabetes', methods=['POST'])
def predict_diabetes():
    # get data
    data = request.get_json(force=True)

    # convert data into dataframe
    data.update((x, [y]) for x, y in data.items())
    data_df = pd.DataFrame.from_dict(data)

    # predictions
    result = diabetes.predict(data_df)

    # send back to browser
    output = {'results': float(result[0])}

    # return data
    return jsonify(results=output)

@app.route('/heart', methods=['POST'])
def predict_heart():
    # get data
    data = request.get_json(force=True)

    # convert data into dataframe
    data.update((x, [y]) for x, y in data.items())
    data_df = pd.DataFrame.from_dict(data)

    # predictions
    result = heart.predict(data_df)

    # send back to browser
    output = {'results': float(result[0])}

    # return data
    return jsonify(results=output)

app.run(host="0.0.0.0",debug=True)