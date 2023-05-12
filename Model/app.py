import pandas as pd
from flask import Flask, jsonify, request
from joblib import load
def warn(*args, **kwargs):
    pass
import warnings
warnings.warn = warn
#from flask_cors import CORS

model=load(open("./Prediction_Deases_final_1.joblib",'rb'))
model2=load(open("./Prediction_Deases_final_2.joblib",'rb'))
diabetes=load(open("./Diabetes_deases.joblib",'rb'))
heart=load(open("./Heart_deases.joblib",'rb'))
df=pd.read_csv("traintest.csv")

app=Flask(__name__)
app.url_map.strict_slashes = False
#CORS(app)

@app.route("/view")
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
    input=[]
    for i in data:
        if(data[i]==1):
            input.append(i)

    # convert data into dataframe
    data.update((x, [y]) for x, y in data.items())
    data_df = pd.DataFrame.from_dict(data)

    # predictions
    result = model2.predict(data_df)

    # send back to browser
    # output = {
    #     'result1': int(result[0][0]),
    #     'result2': int(result[0][1]),
    #     'result3': int(result[0][2]),
    #           }
    disease_dict={
        int(result[0][0]):0,
        int(result[0][1]):0,
        int(result[0][2]):0,
    }
   
    modified_df=df[input]
    data_df=data_df[input]
    re=[]
    for i in range(len(input)):
        if(data_df.iloc[0,i]==1 and modified_df.iloc[int(result[0][0]),i]>0):
            disease_dict[int(result[0][0])]=disease_dict[int(result[0][0])]+1

        if(data_df.iloc[0,i]==1 and modified_df.iloc[int(result[0][1]),i]>0):
            disease_dict[int(result[0][1])]=disease_dict[int(result[0][1])]+1

        if(data_df.iloc[0,i]==1 and modified_df.iloc[int(result[0][2]),i]>0):
            disease_dict[int(result[0][2])]=disease_dict[int(result[0][2])]+1

    for i in disease_dict:
        if(disease_dict[i]>0):
            re.append(i)
    
    # print(output)


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

# app.run(host="0.0.0.0",debug=True)