"use strict"

class Square{
	constructor(hh,vv){
		this.h = hh;
		this.v = vv;
	 }
	toString(){
		return ['a','b','c','d','e','f','g','h'][this.h]+(this.v+1);
	}
	toHTMLString(){
		return `<span class="square">${this.toString()}</span>`
	}
	isBlack(){
		return ((this.h+this.v)%2==0);
	}
	getColor(){
		return this.isBlack() ? "black" : "white";
	}
	
	compare(second){
		return (this.v==second.v)&&(this.h==second.h);
	}
}

function squareFromNum(num){
	return new Square(Math.trunc(num/8),num%8);
}

class Question {
	getButtons(){
		
	}
	
	getQuestionText(){
		
	}
	
	getFeedback(btnid){
		
	}
}

class QuestionSquareColor extends Question {
	
	constructor(){
		super();
		this.square = generateSquare();
	}
	
	getQuestionText(){
		return `What color is ${this.square.toHTMLString()}?`;
	}
	
	getButtons(){
		return {black:'Black',white:'White'};
	}
	getFeedback(btnid){
		return (btnid==this.square.getColor()) ?
		{className:'right',answer:"Correct",explanation:`${this.square.toHTMLString()} is ${this.square.getColor()}`} :
		{className:'wrong',answer:"Incorrect",explanation:`${this.square.toHTMLString()} is ${this.square.getColor()}`}
	}
}

class QuestionTwoSquareColors extends Question{
	constructor(){
		super();
		this.square1 = generateSquare();
		do{
			this.square2 = generateSquare();
		}while(this.square1.compare(this.square2));
	}
	
	getQuestionText(){
		return `Are ${this.square1.toHTMLString()} and ${this.square2.toHTMLString()} the same color?`;
	}
	
	getButtons(){
		return {yes:'Yes',no:'no'};
	}
	
	getFeedback(btnid){
		let txt = `${this.square1.toHTMLString()} is ${this.square1.getColor()} and ${this.square2.toHTMLString()} is ${this.square2.getColor()}`;
		let res = this.square1.isBlack()==this.square2.isBlack();
		return (res&&btnid=="yes")||(!res&&btnid=="no") ? 
			{className:'right',answer:"Correct",explanation:txt} :
			{className:'wrong',answer:"Incorrect",explanation:txt}
	}
}

function getRandomQuestion(){
	let questionTypes = [QuestionTwoSquareColors];
	let selectedType = questionTypes[getRnd(0,questionTypes.length-1)];
	return new selectedType();
}

var question;

function getRnd(a,b){
	return Math.trunc(Math.random()*(b-a)+a);
}

function generateSquare(){
	let num=getRnd(0,63);
	return squareFromNum(num);
}

function setButtons(what){
	let b = document.querySelectorAll("button")
	for(var i=0;i<b.length;i++){
		b[i].disabled=!what;
	}	
}

function submitAnswerDelegate(param){
	return function(){
		submitAnswer(param);
	}
}

function prepareQuestion(){
	question = getRandomQuestion();
	let btns = question.getButtons();
	document.querySelector("#feedback").innerHTML="";
	document.querySelector("#result").innerHTML="";	
	document.querySelector("#buttons").innerHTML = "";
	for(var btn in btns){
		let b = document.createElement("button");
		b.appendChild(document.createTextNode(btns[btn]));
		b.id = btn;	
		b.addEventListener('click',submitAnswerDelegate(btn),false);
		document.querySelector("#buttons").appendChild(b);
	}
	document.querySelector("#question").innerHTML=question.getQuestionText();	
	setButtons(true);
}

function bodyLoad(){
	prepareQuestion();
}

function submitAnswer(param){
	let res = question.getFeedback(param);
	document.querySelector("#feedback").innerHTML=res.explanation;
	document.querySelector("#result").innerHTML=res.answer;
	document.querySelector("#result").className=res.className;
	setButtons(false);
	window.setTimeout(prepareQuestion,3000);
}