const div = document.createElement('div');
div.style = "align-items: center; margin: auto; width: 50%";
const body = document.body;
body.style = "background-color: rgb(219, 188, 255)"
body.append(div);

const what = document.createElement('p');
what.textContent = `Игра "пары"`
what.style.fontSize = "75px"
what.style.fontWeight = "900"
document.body.append(what)
div.append(what)

const vertic = document.createElement('p');
vertic.textContent = "По вертикали карточек?(чётные от 2 до 10)"
vertic.style.fontSize = "25px"
document.body.append(vertic)
div.append(vertic)

const input1 = document.createElement("input")
input1.style = "height: 30px; width: 60%; font-size: large;"
document.body.append(input1)
div.appendChild(input1)

const goriz= document.createElement('p');
goriz.textContent = "По горизонтали карточек?(чётные от 2 до 10)"
goriz.style.fontSize = "25px"
document.body.append(goriz)
div.append(goriz)

const input2 = document.createElement("input")
input2.style = "height: 30px; width: 60%; font-size: large;"
document.body.append(input2)
div.appendChild(input2)

const btn = document.createElement('button');
btn.textContent = "Начать игру"
btn.style = "height: 30px; width: 60%; font-size: large; border: red solid 2px"
document.body.append(btn)
div.append(btn)

div.style.display = "flex"
div.style.flexDirection = "column"
btn.style.marginTop="30px"
btn.addEventListener("click", onClick)

function onClick()  {
    div.remove(); // Удаление меню для показа поля карточек
    
    // Получение данных о кол-ве карт
    n = checkData(input1.value, "вертикали")
    m = checkData(input2.value, "горизонтали")

    // Создание блока поля всех карточек
    const field = document.createElement('div');
    field.style = "align-items: center; display: flex; flex-direction: column;";
    body.append(field)
    
    const btns = [] // Массив всех кнопок(карточек)
    let k = 0 // Счётчик элементов
    for(let i = 0; i < m; i++){
        for(let j = 0; j < n; j++){
            k++
            btns[k] = document.createElement("button")
            btns[k].value = k%2===0 ? k/2 : (k + 1)/2 // Вычисление значения парного числа
            btns[k].style = "height: 95px; width: 95px; margin: 3px; background: url(images/100.jpg);";
        }    
    }

    const row = [] // Массив рядов
    k = -1 // Счётчик элементов
    btns.sort(() => Math.random() - 0.5) // Перемешивание массива карточек
    // Внешний цикл отвечает за добавление рядов в field
    for(let j = 0; j < n; j++){
        row[j] = document.createElement('div');
        field.append(row[j])
        // Внутренний цикл отвечает за добавление элементов в эти ряды
        for(let i = 0; i < m; i++){
            k++ 
            btns[k].ariaRoleDescription = k
            row[j].append(btns[k])
        }    
    }

    let firstCard;
    let secondCard;
    let clickable;
    resetParameters()

    const buttons = document.querySelectorAll("button")
    buttons.forEach(button => {
        button.addEventListener("click", HClick)
    })

    function HClick(e) {
        if (clickable == true && !btns[e.target.ariaRoleDescription].classList.contains("successfully")) { //Если мы можем кликнуть и карта не угадана, то добавляем метку "перевернута"
            btns[e.target.ariaRoleDescription].classList.add("flip")
            btns[e.target.ariaRoleDescription].style.background = "url(images/" + btns[e.target.ariaRoleDescription].value + ".jpg)" // Показываем ее картинку
            btns[e.target.ariaRoleDescription].style.backgroundSize = "95px 95px"

            if (firstCard == null) { // Если переменная firstCard пустая, то даем ей вторичный индекс нажатой карточки  
                firstCard = e.target.ariaRoleDescription
            } else { // Если firstCard заполнена - проверяем вторую карту
                if (e.target.ariaRoleDescription != firstCard) { // Если нажата карточка, не равная firstCard то заполняем secondCard нажатой карточкой 
                    secondCard = e.target.ariaRoleDescription
                    clickable = false // Тогда кликать в данный момент нельзя (перевернуто может быть не более 2 карт)
                }
            }
            // Далее сравниваем значения перевернутых карт
            if (firstCard!=null && secondCard!=null && firstCard != secondCard) { // Если обе переменные непустые и неодинаковые, то сравниваем их
                if (btns[firstCard].value === btns[secondCard].value) { // Если их значения равны то ставим им метку "успех" и обводим зеленым
                    setTimeout(() => {
                        btns[firstCard].classList.add("successfully")
                        btns[secondCard].classList.add("successfully")
                        btns[firstCard].style.border = "5px solid springgreen"
                        btns[secondCard].style.border = "5px solid springgreen"
                        resetParameters() // Сбрасываем переменные firstCard, secondCard и clickable
                    }, 300)
                } else { // В ином случае удаляем метки "перевернута" и соответственно переворачиваем их обратно
                    setTimeout(() => {
                        btns[firstCard].classList.remove("flip")
                        btns[secondCard].classList.remove("flip")
                        btns[firstCard].style.background = "url(images/100.jpg)"
                        btns[secondCard].style.background = "url(images/100.jpg)"
                        resetParameters() // Также сбрасывая переменные firstCard, secondCard и clickable
                    }, 400)
                }
            }

            if ((btns).every(card => card.className.includes('flip'))) { // Если каждая карта имеет метку "перевернута", то завершаем игру перезагружая окно 
                setTimeout(() => {
                    alert("Победа!");
                    location.reload()
                }, 600)
            }
        }
    }
    function resetParameters() {
        firstCard=null;
        secondCard=null;
        clickable=true;
    }
}
function checkData(inp,s) {
    // Если вх данные [2:10] и чётные то вернуть значение
    if (inp > 1 && inp < 11 && inp%2==0)  return inp 
    // В противном случае вывести ошибку и вернуть по умолчанию 4
    else {
        alert("Некорректные данные! По умолчанию 4 карточки по " + s)
        return 4
    }     
}