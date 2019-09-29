/* 
Final Project: Create a grade book program without removing or modifying the HTML or CSS provided.
Requirements: 
    - You must be able to add an assignment that will be displayed in the container grid.
    - You must be able to remove an assignment that has already been displayed in the container grid.
    - The form should not submit unless all fields have been entered.
Extra Credit: 
    - Check for information that has been entered incorrectly, and either alert the user to fix this or properly format the data for the user.
    - Keep separate averages by subject, or try adding weighted grades based on assignment type.
Notes:
    - You may add any new features that you see fit, but ensure that any new changes meet the requirements above.
    - You may only add HTML and CSS if you are implementing new features not required. However, please add comments where these changes have been added in the code. Remember, do not remove or modify any prexisting HTML or CSS.
*/


//=== HTML helper Functions ===
//Provided an HTML id as id, this function will return the value within the HTML element.
function getValue(id) {
    return document.getElementById(id).value;
}

function getElement(id) {
    return document.getElementById(id);
}

    //Provided a string as val and an HTML id as id, this function will set the value within a specified input element to the string provided.
function setValue(val, id) {
    document.getElementById(id).value = val;
}

    //Provided a string as val and an optional HTML id, this funcion will place the HTML string inside the specified HTML element. If no element is specified, it will default to container.
function updateHTML(val, id = 'container') {
    document.getElementById(id).innerHTML = val;
}

var deleteButtonList;

//UI CONTROLLER
var UIController = (function(){
    
    //DOM elements
    var DOMstrings = {
        name: 'h1',
        submitBtn: '#submit',
        subjectInput: 'subject',
        assignmentInput: 'assignment',
        scoreInput: 'score',
        tableBody: '#container',
        deleteBtns: '.delete__btn',
        mathGPA: 'gpa-math',
        scienceGPA: 'gpa-science',
        historyGPA: 'gpa-history',
        average: 'average',
        gpa: 'gpa',
        form: 'mainForm'
    };

    //Adding name to the gradebook
    var studentNamePlaceholder = document.querySelector(DOMstrings.name);
    // var nameInput = prompt('Please enter your full name');
    var studentName = studentNamePlaceholder.innerHTML.replace('%Insert Your Name Here%', 'Chris');
    studentNamePlaceholder.innerHTML = studentName;

    //Grade data
    var mathGrades = [];
    var scienceGrades = [];
    var historyGrades = [];

    //Array for HTML lines added
    var newDOMLines = [];

    return{
        addRow: function(){
            event.preventDefault();

            //subjects
            mathSubjects = ["math", "algebra", "statistics", "calculus", "geometry"];
            scienceSubjects = ["science", "physics", "chemistry", "biology", "astronomy"];
            historySubjects = ["history", "american", "world"];

            //Get user input
            var userInputSubject = getValue(DOMstrings.subjectInput);
            var userInputAssignment = getValue(DOMstrings.assignmentInput);
            var userInputScore = getValue(DOMstrings.scoreInput);

            //Change user input subject to Math/Science/History for grade calc
            var isMathGrade = mathSubjects.includes(userInputSubject.toLowerCase());
            var isScienceGrade = scienceSubjects.includes(userInputSubject.toLowerCase());
            var isHistoryGrade = historySubjects.includes(userInputSubject.toLowerCase());  

            if(!isMathGrade && !isScienceGrade && !isHistoryGrade){
                alert("Please enter a valid subject from the choices below.");
                UIController.formReset();
                return;
            }
            
            //Run function if the user filled out the entire form
            if(userInputSubject && userInputAssignment && userInputScore){
                
                //Push grades to corresponding arrays
                if(isMathGrade){
                    const x = parseInt(userInputScore); 
                    mathGrades.push(x);
                }else if(isScienceGrade){
                    const x = parseInt(userInputScore);
                    scienceGrades.push(x);
                }else if(isHistoryGrade){
                    const x = parseInt(userInputScore);
                    historyGrades.push(x);
                }else{
                    console.log('array.push is not working');
                }

                //Add row properties
                var rowColor;
                var rowColorID;

                if(isMathGrade){
                    rowColor = '#FAD7A0';
                    rowColorID = 1;
                }else if(isScienceGrade){
                    rowColor = '#A9DFBF';
                    rowColorID = 2;
                }else if(isHistoryGrade){
                    rowColor = '#AED6F1'
                    rowColorID = 3;
                }else{
                    rowColor = 'none'
                    rowColorID = 4;
                }

                //Get letter grade and if it's an "F" change color to red
                if(userInputScore >= "90"){
                    letterGrade = "<td>A</td>";
                }else if(userInputScore >= 80 && userInputAssignment < 90){
                    letterGrade = "<td>B</td>";
                }else if(userInputScore >= 70 && userInputAssignment < 80){
                    letterGrade = "<td>C</td>";
                }else if(userInputScore >= 60 && userInputAssignment < 70){
                    letterGrade = "<td>D</td>";
                }else if(userInputScore < 60){
                    letterGrade = "<td style='color: red;'>F</td>";
                }else{
                    alert = "Something broke! Please Refresh the page and try again.";
                }

                //Clear the container, build HTML for DOM, and store in an array to sort
                var mainContainer = document.querySelector(DOMstrings.tableBody);
                mainContainer.innerHTML = '';

                var uiRow = `<tr style="background-color:${rowColor};"><td>` + UIController.titleCase(userInputSubject) + '</td><td>' + userInputAssignment + '</td><td>' + userInputScore + '</td>' + letterGrade + '<td><p class="delete__btn" style="cursor:pointer; margin-left: auto; padding-right: 1em; width: 2em;">X</p></td></tr>';

                var newRow = new UIController.GradeRow(userInputSubject.toLowerCase(), uiRow, rowColor, rowColorID, userInputAssignment);
                newDOMLines.push(newRow);
                newDOMLines.sort((a, b) => (a.rowColorID > b.rowColorID) ? 1 : -1);

                for(const cur of newDOMLines){
                    mainContainer.innerHTML += cur.UI;
                }
                console.log(newDOMLines);
                
                //Clear contents of form and refocus
                UIController.formReset();

                //Delete button setup
                deleteButtonList = document.querySelectorAll(DOMstrings.deleteBtns);
                for(i=0; i<deleteButtonList.length; i++){
                    deleteButtonList[i].addEventListener('click', UIController.deleteRow);
                }

                UIController.calcGrade(mathGrades, scienceGrades, historyGrades);
                
            }else{
                alert('Please fill out all available fields.');
            }
        },
        
        deleteRow: function(){
            //Remove row markup
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

            //Get data from delete row
            var DOMscore = parseInt(this.parentNode.parentNode.children[2].innerHTML);
            var arr = this.parentNode.parentNode.firstChild.innerHTML.toLowerCase();
            var newArr;

            var isMathGrade = mathSubjects.includes(arr.toLowerCase());
            var isScienceGrade = scienceSubjects.includes(arr.toLowerCase());
            var isHistoryGrade = historySubjects.includes(arr.toLowerCase());

            if(isMathGrade){
                newArr = mathGrades;
            }else if(isScienceGrade){
                newArr = scienceGrades;
            }else if(isHistoryGrade){
                newArr = historyGrades;
            }else{
                console.log('Delete row function isnt working');
            }

            //Find the removed markup in the array and remove it
            for(i=0; i<newArr.length; i++){
                if(newArr[i] === DOMscore){
                    newArr.splice(newArr.indexOf(newArr[i]),1);
                    break;
                }
            }
            //Remove line from newDOMLines
            var objectSubject = this.parentNode.parentNode.children[0].innerHTML.toLowerCase();
            var objectAssignment = this.parentNode.parentNode.children[1].innerHTML;
            
            var objectIndex = newDOMLines.findIndex(function(element){
                
                return element.subject === objectSubject && element.lineAssignmentName === objectAssignment;
                
            });

            newDOMLines.splice(objectIndex,1);
            
            UIController.calcGrade(mathGrades, scienceGrades, historyGrades);
        },

        calcGrade: function(mathScores, scienceScores, historyScores){
            var mathElement = getElement(DOMstrings.mathGPA);
            var scienceElement = getElement(DOMstrings.scienceGPA);
            var historyElement = getElement(DOMstrings.historyGPA);
            
            //1. Math grade
            if(mathGrades.length != 0){
                var mathSum = 0;
                for(i=0; i<mathScores.length; i++){
                    mathSum += mathScores[i];
                }
                var mathAvg = parseInt(mathSum / mathGrades.length).toFixed(2);
                var mathPercent = mathAvg + '%';
                mathElement.innerHTML = mathPercent;
            }else{
                mathElement.innerHTML = '-';
            }
            
            //2. Science grade
            if(scienceGrades.length != 0){    
                var scienceSum = 0;
                for(i=0; i<scienceScores.length; i++){
                    scienceSum += scienceScores[i];
                }
                var scienceAvg = parseInt(scienceSum / scienceGrades.length).toFixed(2);
                var sciencePercent = scienceAvg + '%';
                scienceElement.innerHTML = sciencePercent;
            }else{
                scienceElement.innerHTML = '-';
            }

            //3. History grade
            if(historyGrades.length != 0){
                var historySum = 0;
                for(i=0; i<historyScores.length; i++){
                    historySum += historyScores[i];
                }
                var historyAvg = parseInt(historySum / historyGrades.length).toFixed(2);
                var historyPercent = historyAvg + '%';
                historyElement.innerHTML = historyPercent;
            }else{
                historyElement.innerHTML = '-';
            }

            UIController.calcGPA(mathAvg, scienceAvg, historyAvg);
        },
        
        calcGPA: function(math, science, history){
            //Make array from pass data
            let arr = [math, science, history];
            let gpaPoints = [];

            //Slice % symbol off end of string and assign to gpa points
            for(i=0; i<arr.length; i++){
                if(arr[i] !== undefined){
                    let x = arr[i].slice(0, -1);

                    if(x >= 90){
                        gpaPoints.push(4);
                    }else if(x >= 80 && x < 90){
                        gpaPoints.push(3);
                    }else if(x >= 70 && x < 80){
                        gpaPoints.push(2);
                    }else if(x >= 60 && x < 70){
                        gpaPoints.push(1);
                    }else{
                        gpaPoints.push(0);
                    }
                }
            }

            //Calculate the average of the gpa points
            let sum = 0;
            for(i=0; i<gpaPoints.length; i++){
                sum += gpaPoints[i];
            }

            let gpa = (sum / gpaPoints.length).toFixed(2);
            let DOMavg = getElement(DOMstrings.gpa);

            if (gpaPoints.length != 0) {
                DOMavg.innerHTML = gpa;    
            }else {
                DOMavg.innerHTML = '-';
            }
        },
        GradeRow: function(subject, UI, color, rowColorID, lineAssignmentName){
            this.subject = subject;
            this.UI = UI;
            this.color = color;
            this.rowColorID = rowColorID;
            this.lineAssignmentName = lineAssignmentName;
        },
        getDOMstrings: function(){
            return DOMstrings;
        },
        formReset: function(){
            getElement(DOMstrings.form).reset();
            getElement(DOMstrings.subjectInput).focus();
        },
        titleCase: function(word){
            word.toLowerCase();
            const firstLetterCapitalized = word.charAt(0).toUpperCase();
            const subjectWithoutFirstChar = word.slice(1);
            return firstLetterCapitalized + subjectWithoutFirstChar;
        }

    }   
})();