# Multiple Linear Regression

# Importing the libraries
import sys
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle 

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import Normalizer, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
# sys.argv =['','routes\\uploads\\file-1569970490902.csv','false','' , '' ,'4','3','1','ajax']
# sys.argv =['','routes\\uploads\\file-1569970490902.csv','true','eewcwwcew' , '3' ,'4','0','1','ajax']
# sys.argv =['','routes\\uploads\\file-1571607584824.csv','true','Business Analyst,Junior Consultant,Senior Consultant,Manager,Country Manager,Region Manager,Partner,Senior Partner,C-level,CEO' , '0' ,'2','1','1','roei kolpo']

numOfinVar=int(sys.argv[5])
normColIndexes=[]
catDataIndex=sys.argv[4]
learningType=int(sys.argv[7])
nOfcatData=0
IsDropedCol=False
isFailed=False
toPlus=False
global colTobject
global TheModel
    # Importing the dataset
dataset = pd.read_csv(sys.argv[1])

try:
    if(sys.argv[6]!=''):
       #we want to drop column
        unUsedcolInedx=int(sys.argv[6])
        dataset= dataset.drop(dataset.columns[unUsedcolInedx], axis=1)
        numOfinVar=numOfinVar-1 
        IsDropedCol=True         
    X = dataset.iloc[:, :-1].values
    y = dataset.iloc[:, numOfinVar].values
    if sys.argv[2]=='true':
        catDataIndex=int(catDataIndex)
        if IsDropedCol:
            if unUsedcolInedx<catDataIndex:
                catDataIndex=catDataIndex-1
        categorialDArr=sys.argv[3].split(',') 
        if len(categorialDArr)>2:
                toPlus=True
                # avoid dummy var 
                nOfcatData=len(categorialDArr)-1   
        for i in range(numOfinVar):
                #  numeric data to normalize
            if i!=catDataIndex:
             normColIndexes.insert(len(normColIndexes),i)
        colT = ColumnTransformer( [("dummy_col", OneHotEncoder(categories=[categorialDArr]), [catDataIndex]),
        ("norm", Normalizer(norm='l1'), normColIndexes)])
        X = colT.fit_transform(X)
        X = X[:, 1:]
        colTobject=colT
    else:
                  # there is no categorial data
        sc = StandardScaler()
        X= sc.fit_transform(X)
        colTobject=sc
    colTobjectName = sys.argv[8]+'_'+'colT.sav'
    pickle.dump(colTobject, open(colTobjectName, 'wb'))
    if learningType==1:
                regressor = RandomForestRegressor(n_estimators =300, random_state = 0)
                regressor.fit(X, y)
                TheModel=regressor
    if learningType==2:
                classifier = RandomForestClassifier(n_estimators = 10, criterion = 'entropy', random_state = 0)
                classifier.fit(X, y)
                TheModel=classifier
    TheModelName = sys.argv[8]+'_'+'finalized_model1.sav'

    pickle.dump(TheModel, open(TheModelName, 'wb'))
    if(toPlus):
                # sum the importancne of each categorial Data
                isPrintedSum=False
                sumOfImp=0
                for impIndex in  range (len(TheModel.feature_importances_)+1):
                    if impIndex<nOfcatData:
                        sumOfImp=sumOfImp+TheModel.feature_importances_[impIndex]
                    else:
                        if not isPrintedSum:
                            print  (sumOfImp)
                            isPrintedSum=True
                        else:
                             print (TheModel.feature_importances_[impIndex-1])
    else:
                for fImp in TheModel.feature_importances_:
                    print(fImp)
             
    if catDataIndex !='':
                print (dataset.columns[catDataIndex])
                for col in normColIndexes:
                    print (dataset.columns[col])
    else:
                for s in range (len(dataset.columns)-1) :
                 print (dataset.columns[s])               
except: 
    print (-1)        

