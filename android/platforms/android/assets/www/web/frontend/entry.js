import { Model } from 'keras-js'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'

const model = new Model({
  filepaths: {
    model:  'model_mushrooms.json',
    weights: 'model_mushrooms_weights.buf',
    metadata: 'model_mushrooms_metadata.json'
  },
  gpu: true
})

window.predict = function () {
  model.ready()
  .then(() => {	
	var canvas = document.getElementById("input-canvas");
	var img1 = document.getElementById("holder"); 
		
	canvas.width = img1.width; 
	canvas.height = img1.height; 
	var ctx = canvas.getContext("2d"); 
	ctx.drawImage(img1, 0, 0, 229, 229);

	var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
	var { data, width, height } = imageData    

	// data processing
	// see https://github.com/fchollet/keras/blob/master/keras/applications/imagenet_utils.py
	var dataTensor = ndarray(new Float32Array(data), [width, height, 4])
	var dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3])

	ops.divseq(dataTensor, 255)
	ops.subseq(dataTensor, 0.5)
	ops.mulseq(dataTensor, 2)
	ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0))
	ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1))
	ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 2))

	var preprocessedData = dataProcessedTensor.data
  
	var inputData = { "input_1": preprocessedData }
	
	console.log("Predicting...");
    return model.predict(inputData)
  })
  .then(outputData => {
	
	var classes = ['Agaricus campestre', 'Agrocybe aegerita', 'Aleuria auranta', 'Amanita caesa', 'Boletus aereus', 'Calocybe gambosa', 'Cantaharellus lutecens', 'Cantharellus cibbarius', 'Chroogomplus rutilus', 'Clitocibe nebularis', 'Coprinus comatus', 'Giromintra esculenta', 'Hidnum repandum o Lengua de vaca', 'Higrophorus limacinus', 'Hygrophorus marzuolus', 'Hygrophorus russula', 'Inonatus tamaricis', 'Lactarius deliciosus', 'Lactarius fuliginosus', 'Lactarius torminousus', 'Lepiota bruneoincarnata', 'Marasmius oreades, Senderuela', 'Morchella esculenta', 'Omphalotus olearius', 'Paxinus involutus', 'Phallus impudicus', 'Pleorutus ostreatus', 'Pleurotus erygii', 'Romaria aurea', 'Russula cyanoxantha', 'Russula ilicis', 'Russula virescens', 'Suillus bellini', 'Suillus granulatus', 'Tricholoma georgil', 'Tricholoma terreum', 'Tuber melanosporum', 'amanita muscaria', 'amanita panteherina', 'amanita phalloides', 'amanita proxima', 'boletus aestivalis', 'boletus edulis', 'boletus pinophilus', 'boletus satanas', 'craterellus cornucopioides', 'democybe especiossisimus', 'entoloma lividum', 'galerina marginata', 'macrolepiota procera', 'sarcosphaera'];
	
    var predictions = outputData['dense_2'];
    let max = -1;
	let digit = null;
    let digits = [];
	let maxs = []
	for(var j = 0; j < 3; j++)
	{
		for (let i in predictions) {
		  if (!digits.includes(i))
		  {
			  let probability = predictions[i];
			  if (probability > max) {				  
				max = probability;
				digit = i;				
			  }
		  }
		}
		
		maxs.push(max);
		digits.push(digit);	
		max = -1;
	}
	
	var probs = "";
	for(var j = 0; j < 3; j++)	
		probs += "Predicted: " + classes[digits[j]] + " with probability " + (maxs[j].toFixed(3)*100) + "%<br>";
	
	document.getElementById("result").innerHTML = probs;  
	
	console.log(predictions);
  })
  .catch(err => {
    console.log(err)
  })
}
  