from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, UpSampling2D

def build_model():
    inp = Input(shape=(64,64,3))

    x = Conv2D(32,3,activation='relu',padding='same')(inp)
    x = MaxPooling2D(2,padding='same')(x)

    x = Conv2D(16,3,activation='relu',padding='same')(x)
    x = MaxPooling2D(2,padding='same')(x)

    x = Conv2D(16,3,activation='relu',padding='same')(x)
    x = UpSampling2D(2)(x)

    x = Conv2D(32,3,activation='relu',padding='same')(x)
    x = UpSampling2D(2)(x)

    out = Conv2D(3,3,activation='sigmoid',padding='same')(x)

    model = Model(inp,out)
    model.compile(optimizer='adam',loss='mse')

    return model
