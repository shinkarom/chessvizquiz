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

function areSquaresSameColor(square1,square2){
	return square1.isBlack()==square2.isBlack();
}

function areSquaresOnBishopMove(square1,square2){
	return (!square1.compare(square2))&&(Math.abs(square1.h-square2.h)==Math.abs(square1.v-square2.v));
}

function areSquaresOnRookMove(square1,square2){
	return (!square1.compare(square2))&&((Math.abs(square1.h-square2.h)==0)||(Math.abs(square1.v-square2.v)==0));
}

function areSquaresOnQueenMove(square1,square2){
	return areSquaresOnBishopMove(square1,square2)&&areSquaresOnRookMove(square1,square2);
}

function areSquaresOnKnightMove(square1,square2){
		let l1 = (Math.abs(square1.h-square2.h)==2)&&(Math.abs(square1.v-square2.v)==1);
		let l2 = (Math.abs(square1.h-square2.h)==1)&&(Math.abs(square1.v-square2.v)==2);
		return l1||l2;
}

function areSquaresOnKingMove(square1,square2){
	return (!square1.compare(square2))&&(Math.abs(square1.v-square2.v)<=1)&&(Math.abs(square1.h-square2.h)<=1);
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
		let res = areSquaresSameColor(this.square1,this.square2);
		return (res&&btnid=="yes")||(!res&&btnid=="no") ? 
			{className:'right',answer:"Correct",explanation:txt} :
			{className:'wrong',answer:"Incorrect",explanation:txt}
	}
}

class QuestionPieceMove extends Question{
	constructor(){
		super();
		let pieces = [{pieceName:"bishop",predicate:areSquaresOnBishopMove},{pieceName:"rook",predicate:areSquaresOnRookMove},{pieceName:"knight",predicate:areSquaresOnKnightMove},{pieceName:"queen",predicate:areSquaresOnQueenMove},{pieceName:"king",predicate:areSquaresOnKingMove}];
		let selectedPiece = choice(pieces);
		this.pieceName = selectedPiece.pieceName;
		this.predicate = selectedPiece.predicate;
		this.square1 = generateSquare();
		this.movables = [];
		this.nonMovables = [];
		for(var n=0;n<=63;n++){
			let tmpSquare = squareFromNum(n);
			if(this.square1.compare(tmpSquare))
				continue;
			(this.predicate(this.square1,tmpSquare) ? this.movables : this.nonMovables).push(tmpSquare);
		}
		let a = (getRnd(0,2)==0) ? this.movables : this.nonMovables;
		this.square2 = choice(a);
	}
	
	getQuestionText(){
		return `Can a ${this.pieceName} on ${this.square1.toHTMLString()} move to ${this.square2.toHTMLString()}?`;
	}
	
	getButtons(){
		return {yes: "Yes",no:"No"};
	}
	
	getFeedback(btnid){
		let txt="";
		let res = this.predicate(this.square1,this.square2);
		return (res&&btnid=="yes")||(!res&&btnid=="no") ? 
			{className:'right',answer:"Correct",explanation:txt} :
			{className:'wrong',answer:"Incorrect",explanation:txt}
	}
}

function getRandomQuestion(){
	let questionTypes = [QuestionSquareColor,QuestionTwoSquareColors,QuestionPieceMove];
	let selectedType = choice(questionTypes);
	return new selectedType();
}

var question;

function getRnd(a,b){
	return Math.trunc(Math.random()*(b-a)+a);
}

function choice(ar){
	return ar[getRnd(0,ar.length)];
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