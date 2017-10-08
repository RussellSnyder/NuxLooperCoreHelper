const shell = require('shelljs');
const readline = require('readline');
var fs = require('fs');
var os = require('os');

const finalFolderName = 'ready4NuxLoopCore';
const audioMapFileName = 'audioMap';
const wNameArray = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Generate the names to be used as folders and audio file names
for (let i = 1; i < 100; i++) {
    let suffix = i.toString().length < 2 ? '0' : '';
    let wName = 'W0' + suffix + i;
    wNameArray.push(wName);
}

// get the input and output folder from the user
let inputFolder = 'audioFiles';
let outputFolder = 'output';

//
// rl.question('Enter input folder', (answer) => {
//     inputFolder = answer;
// });
// rl.question('Enter output folder', (answer) => {
//     outputFolder = answer;
// });



// Create the Nux output directory in output folder
let audioOutputDirectory = outputFolder + '/' + finalFolderName + '/';
// let tempDirectory = audioOutputDirectory + 'tmp';
let setMap = outputFolder + '/' + audioMapFileName + '.txt';

// reset output file directories
shell.rm('-rf', outputFolder);
shell.mkdir(outputFolder);
shell.mkdir(audioOutputDirectory);
shell.touch(setMap);
// shell.mkdir(tempDirectory);
// wNameArray.forEach(name => {
//     shell.mkdir(audioOutputDirectory + '/' + name)
// })

// grab tracks in sub folders and create a heiarchy of song and scenes in that song
// at the same time copy all the tracks to a flat list in the output directory

let audioObjectMap = {};
shell.cd(inputFolder)
shell.ls().forEach(folder => {
    audioObjectMap[folder] = [];
    shell.cd(folder + '/')
    shell.ls().forEach(scene => {
    // let outputFolder = '../../' + tempDirectory + '/'
    // shell.cp(scene, outputFolder)
    audioObjectMap[folder].push(scene);
    });
    shell.cd('../')
})
shell.cd('../')

// rename and file, create folder and place it into the folder
// and echo into set Map its new name / location
const today = new Date();
let setMapArray = [`SPLISS Set generated on ${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()} at ${today.getHours()}:${today.getMinutes()}${os.EOL}`];
let numberOfScenes = 0;
Object.keys(audioObjectMap).forEach(song => {
    setMapArray.push(`${os.EOL}-- ${song} --${os.EOL}`);
    audioObjectMap[song].forEach(scene => {
        shell.mkdir(audioOutputDirectory + '/' + wNameArray[numberOfScenes])
        shell.cp(`${inputFolder}/${song}/${scene}`, `${audioOutputDirectory}/${wNameArray[numberOfScenes]}/${wNameArray[numberOfScenes]}.txt`)
        setMapArray.push(`${wNameArray[numberOfScenes]}: ${scene} ${os.EOL}`);
        numberOfScenes++;
    })
})

// Create text document with the wName next to the file name in the output folder
fs.writeFileSync(setMap, setMapArray.join(''), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});


console.log('You are ready to rock!');
process.exit();