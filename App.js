import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import {Picker} from '@react-native-community/picker';

export default function App() {

  // Хранилище данных
  const [value, setValue] = useState('')
  const [translated, setTranslated] = useState('')
  const [select, setSelect] = useState('English')
  const [langCode, setLangCode] = useState('en')
  const [langsList, setLangsList] = useState({
    codes: [],
    lng: []
  })
  
  // Данные необходимые для составления запроса к апи
  const url = 'https://translate.yandex.net/api/v1.5/tr.json/'
  const translate = 'translate'
  const langs = 'getLangs'
  const key = 'trnsl.1.1.20200511T063326Z.17bcfcc7a7bf45e2.b75815a6e13dc354eba942e3196c7688776ad00c'

  // Получение списка поддерживаемых языков для перевода
  useEffect(() => {
    axios(url + langs + '?key=' + key + '&ui=en' ).then(({data}) => {
      langArray = data.langs
      setLangsList(prev => ({ 
        ...prev,
        codes: Object.keys(langArray),
        lng: Object.values(langArray)
      }))
      if (value === '') setTranslated('')
    })
  }, [])
  
  // Обращение к апи для получения перевода введенного текста
  handleChange = () => {
    if (value !== '' && langCode) {
    axios(url + translate + '?key=' + key + '&text=' + encodeURI(value) + '&lang=' + langCode).then(({data}) => {
      var translate = data.text
      setTranslated(translate.join(' '))
    })
    }
  }

  // Вывод пользовательского интерфейса
  return (
    <View style={styles.container}>
      <View style={styles.firstInputContainer}>
        <TextInput
          multiline
          style={styles.input}
          placeholder='Type text to translate'
          onChangeText={(val) => setValue(val)}
          onChange={handleChange()}
        />
      </View>
      <View style={styles.selectContainer}>
          <Text style={styles.text}>Translate to: </Text>
          <Picker
            style={styles.selectItem}
            selectedValue={select}
            onValueChange={(value, id) => {
              setSelect(value)
              setLangCode(langsList.codes[id])
            }}
          >
            {langsList.lng.map((lang, id) => 
              <Picker.Item key={id} label={lang} value={lang}/>
            )}
          </Picker>
      </View>
      <View style={styles.secondInputContainer}>
        <TextInput
          multiline
          style={styles.input}
          placeholder="Here's translated text"
          defaultValue={translated}
        />
      </View>
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 20 
  },
  firstInputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  secondInputContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  selectContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  selectItem: {
    flex: 2/1.3,
    fontSize: 20,
    fontWeight: '700',
    color: '#7B8195',
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#7B8195',
    marginLeft: 15
  },  
  input: {
    margin: 10,
    color: '#616161',
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#7B8195'
  },
  button: {
    borderRadius: 10
  }
});
