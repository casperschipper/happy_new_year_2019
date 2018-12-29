(
{
	{
		var f7 = VarSaw.ar( LFNoise1.ar(0.5).range(-30,10).midicps, width:0.5).range(-80,10);
		var f6 = LFNoise1.ar( LFNoise0.ar(0.1).range(-40,18).midicps ).range(-30,137).midicps;
        var f5 = VarSaw.ar( LFNoise1.ar(0.5).range(-30,10).midicps, width:0.5).range(-80,-0).midicps;
		var f4 = VarSaw.ar( LFNoise0.ar(0.5).range(0,100).midicps, width:0.5).range(0,137);
		var f3 = VarSaw.ar( 2, width:0.5).range(0,100);
		var f2 = LFNoise1.ar( LFNoise0.ar(0.3).range(0,f3).midicps ).range(0,137).midicps;
		var f1 = VarSaw.ar( f2, width:0.5 ).range(0,f4).midicps;
		var sig = SinOsc.ar( Latch.ar(f1,Impulse.ar(f6)) , mul:f7.midicps).sin * 0.2;
		var stereo = Pan2.ar( sig, SinOsc.ar( f5));
		sig = FreeVerb2.ar(stereo[0],stereo[1],0.1,0.001);
		Out.ar( 0, sig );
	}.play;
}.();
)

s.scope;