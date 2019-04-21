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
		return {black:'black',white:'white'};
	}
	getFeedback(btnid){
		return (btnid==this.square.getColor()) ?
		{className:'right',answer:"Correct",explanation:`${this.square.toHTMLString()} is ${this.square.getColor()}`} :
		{className:'wrong',answer:"Incorrect",explanation:`${this.square.toHTMLString()} is ${this.square.getColor()}`}
	}
}

function getRandomQuestion(){
	return new QuestionSquareColor();
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