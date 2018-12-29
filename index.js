function Kerst ( ) {
	// module notation
	const ctx = new (AudioContext || webkitAudioContext)();
	const sched = new WebAudioScheduler({ context: ctx });
	console.log(ctx);
	console.log(sched);

	var BPM = 80;
	var quarterNote = (60.0 / BPM) / 4.0; 

	var Nt = function(pitch,dur) {
		return {"pitch": pitch,"dur": dur};
	}

	var Rst = function(dur) {
		return {"pitch": -1, "dur" : dur};
	}

	var playSong = function ( e ) {
		const t0 = e.playbackTime;
		let sum = 0;
        
        while(sum < (4*quarterNote)) {
        	let nextNote = song.next();
        	// schedule next event, parameters are provided seperately
//debug
        	console.log()
        	sched.insert(t0 + sum, playNote, nextNote);
        	sum += nextNote.dur;
        }
        // keep things going:
		sched.insert(t0 + (4 * quarterNote),playsong);
	}

	var songIter = function ( ) {
		let index = 0;
		let score = [
			Nt(60,1),
			Nt(65,0.75),
			Nt(65,0.25),
			Nt(65,1),
			Rst(1),
			Nt(67,1),
			Nt(69,0.75),
			Nt(69,0.25),
			Nt(69,1.0),
			Rst(0.25),
			Nt(69,0.25),
			Nt(67,0.25),
			Nt(69,0.25),
			Nt(70,1.0),
			Nt(64,1.0),
			Nt(67,1.0),
			Nt(75,0.75),
			Nt(75,0.75),
			Nt(60,1),
			Nt(65,0.75),
			Nt(65,0.25),
			Nt(65,1),
			Rst(1),
			Nt(67,1),
			Nt(69,0.75),
			Nt(69,0.25),
			Nt(69,1.0),
			Rst(0.25),
			Nt(69,0.25),
			Nt(67,0.25),
			Nt(69,0.25),
			Nt(70,1.0),
			Nt(64,1.0),
			Nt(67,1.0),
			Nt(75,0.75),
			Nt(75,0.75)];

		const iterator = {
			next: function ( ) {
				if (index >= score.length) {
					index = 0; // this means loop the song;
				}
				return score[index++];
			}
		}
		return iterator;
	};

	var mtof = function (midi) {
		return 440.0 * Math.pow(2,(midi-69)/12.0);
	}

	var noteOn = function( e ) {
		if (pitch < 0) {
			// rest;
			return;
		}
		let pitch = e.pitch;
		let duration = e.dur;
		let velo = e.velo;
		let t0 = e.playbackTime;
		let t1 = t0 + e.dur;

		let osc = ctx.createOscillator();
		let gain = ctx.createGain();
		let filter = ctx.createBiquadFilter();

		gain.gain.setValueAtTime(0.1,t0);
		gain.gain.linearRampToValueAtTime(0,t1);

		osc.connect(gain);
		gain.connect(filter);
		filter.connect(ctx.destination);

		let frequency = mtof(pitch);
		// oscillator setup:
		osc.type = 'square'	;
		osc.frequency.value = frequency; // value in hertz
		osc.start();

		// filter setup:
		filter.type = "lowpass";
		filter.frequency.setValueAtTime(10000,t0);
		filter.Q = 0.9;
		filter.frequency.linearRampToValueAtTime(1000,t1);

		sched.nextTick(t1, () => { osc.stop() });
		// envelope
	}
	//noteOn(63,3.0);

	document.getElementById("start-button").addEventListener("click", () => {
 	 	sched.start(songIter);  
 	 	document.getElementById("status").innerHTML = "playing";
	});

	document.getElementById("stop-button").addEventListener("click", () => {
  		sched.stop(true);
 	 	document.getElementById("status").innerHTML = "stop";
	});
	console.log('hello', ctx, sched);
};

window.onload = Kerst();