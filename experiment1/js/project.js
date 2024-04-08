// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {  
    greeting: ["Whats good", "Sup", "Waddap", "Hello", "Hey there", "Yoohoo", "Yerr", "Heya", "Praise the Lord", "Bismallah", "Yo yo yo", "Suh", "Suh dude", "My armpits STINK... anyways how you doing", "Hail Satan", "Shut up and listen to me"],
    prefix: ["Sir", "Maam", "Bro", "Broseph", "Proffessor", "Gurl", "Gorl", "Girlie", "Madam", "Lord", "Broskie", "Queen", "Your Excellency", "Honorable"],
    title: ["Rizzler", "Himothy", "Short King", "Bummy McBumface", "Charlatan", "Gringo", "Dank Memer"],
    role: ["Pickup Artist", "Farmer", "Cult Overthrower", "Demon Lord", "Princess", "Prince", "King", "Scam Artist", "Dropshipper", "Salesperson", "Hunter", "Predator", "Captain", "CEO", "Test Subject"],
    company: ["Alpha Male Cultivators", "OopsiePoopsie Enterprises", "QuirkyQuark Co.", "OopsieDaisy Enterprises", "CringeMaster Co.", "Yikes Corps", "Randomonium Inc.", "Gen Alpha Literacies", "MemeMachine Innovations", "HappyGoLucky Co.", "TickleTech Solutions"],
    advertisment: ["zoo", "back of a bottlecap", "3rd page of a newspaper", "reddit 50/50 page", "top of a short bald guy's head", "drunk cosplay convention", "orphanage", "playground", "bottom of a receipt from Walmart", "AA meetup"],
    emotion: ["anhedonia", "euphobia", "malu", "eleutheromania", "cataplexy", "onism", "kenopsia", "exulansis", "occhiolism", "monachopsis", "acedia", "sonder", "lachesism", "liberosis", "vemödalen"],
    descriptive: ["ruthless", "exploitative", "monopolistic", "cutthroat", "unscrupulous", "greedy", "arrogant", "manipulative", "opportunistic", "predatory", "unethical", "corrupt", "overbearing", "domineering", "ruthless", "deceptive", "unsympathetic", "mercenary", "callous", "machiavellian"],
    startHour: ["1","2", "3", "4", "5", "6", "7", "8", "9"],
    endHour: ["4", "5", "6", "7", "8", "9", "10", "11"],
    wage: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
    adjective: ["incompetent", "lazy", "dishonest", "unreliable", "arrogant", "rude", "disorganized", "insubordinate", "unmotivated", "irresponsible", "clueless", "obnoxious", "unqualified", "careless", "indecisive", "passive", "entitled", "forgetful", "unprofessional", "inattentive"]
  };
  
  
  const template = `$greeting $prefix $title, I want to apply for the role of $role at $company.
  
  I saw your flier at the $advertisment and I felt $emotion at the thought of working at your $descriptive company.
  
  I agree with the hours of $startHour am to $endHour pm with a wage of $wage dollars per hour and I think that I will be a $adjective prospect for this role.`;
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
}

// let's get this party started - uncomment me
main();