"use strict"

let num=0

function getSquare(){
	const hors=['a','b','c','d','e','f','g','h'];
	let h=Math.trunc(num/8);
	let v=1+(num%8);
	return "<span class=\"square\">"+hors[h]+v+"</span>";
}

function getColor(){
	let h=Math.trunc(num/8);
	let v=num%8;
	return (h+v)%2==0 ? "black" : "white";
}

function getRnd(a,b){
	return Math.trunc(Math.random()*(b-a)+a);
}

function generateSquare(){
	num=getRnd(0,63);
	console.log(num);
}

function setButtons(what){
	let b = document.querySelectorAll("button")
	for(var i=0;i<b.length;i++){
		b[i].disabled=!what;
	}	
}

function prepareQuestion(){
	document.querySelector("#feedback").innerHTML="";
	document.querySelector("#result").innerHTML="";
	generateSquare();
	document.querySelector("#question").innerHTML="What color is "+getSquare()+"?";
	setButtons(true);
}

function bodyLoad(){
	document.querySelector("#black").addEventListener("click",submitAnswer);
	document.querySelector("#white").addEventListener("click",submitAnswer);
	prepareQuestion();
}

function submitAnswer(){
	let c=getColor();
	let l=getSquare()+" is "+c;;
	document.querySelector("#feedback").innerHTML=l;
	document.querySelector("#result").innerHTML=getColor()==this.id?"Yes":"No";
	document.querySelector("#result").className=getColor()==this.id?"right":"wrong";
	setButtons(false);
	window.setTimeout(prepareQuestion,3000);
}