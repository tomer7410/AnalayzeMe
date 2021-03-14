
b=['','165349.2,136897.8,471784.1,New York,192261.83','3','finalized_model.sav','colT.sav']
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import Normalizer, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
import sys,os
try:
    # sys.argv=['','Manager','roei kolpo','3']
    catData=''
    userInput=sys.argv[1].split(',')
    for value in userInput:
        try:
         float(value)
         continue
        except ValueError:
         catData=value
    sys.path.append(os.path.abspath(os.path.join('..')))
    modelname=sys.argv[2]+'_finalized_model1.sav'
    loaded_model = pickle.load(open(modelname, 'rb'))
    modelname1=sys.argv[2]+'_colT.sav'
    loaded_model1 = pickle.load(open(modelname1, 'rb'))
    tranformedData=loaded_model1.transform([userInput])
    if catData!='':
     tranformedData = tranformedData[:, 1:]
    print (loaded_model.predict(tranformedData)[0])
    toStopCheck=False
    for t in tranformedData:
        for d in t:
            if(d==0 or d==1 ):
                continue
            if(not toStopCheck):
                if(catData != '' ):
                    print (catData)
                    toStopCheck=True
            print(d)
       
       
except:
    print(-1) 

        