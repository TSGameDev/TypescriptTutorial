//These are constants, values wont change
const number1 = "2";
const number2 = 5.6;

//These are variables, values can change
let printResult = true;

function Add(num1: number, num2: number, printResult: boolean){
    const addResult = num1 + num2;
    if(printResult){
        console.log(addResult);
    }
    return addResult;
}

Add(-number1, number2, printResult);