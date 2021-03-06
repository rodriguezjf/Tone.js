define(["Test", "Tone/core/Offline", "Tone/core/Transport", "Tone/source/Oscillator", 
	"Tone/core/Tone", "Tone/core/Buffer", "helper/BufferTest"], 
	function (Test, Offline, Transport, Oscillator, Tone, AudioBuffer, BufferTest) {

	describe("Offline", function(){

		it ("exists", function(){
			expect(Offline).to.exist;
			expect(Tone.Offline).to.exist;
		});

		it ("accepts a callback and a duration", function(){
			Offline(function(){}, 0.01);
		});

		it ("returns a promise", function(){
			expect(Offline(function(){}, 0.01)).to.be.instanceOf(Promise);
		});

		it ("generates a buffer", function(done){
			Offline(function(){}, 0.01).then(function(buffer){
				expect(buffer).to.be.instanceOf(AudioBuffer);
				done();
			});
		});

		it ("silent by default", function(done){
			Offline(function(){}, 0.01).then(function(buffer){
				BufferTest(buffer);
				expect(buffer.isSilent()).to.be.true;
				done();
			});
		});

		it ("records the master output", function(){
			return Offline(function(){
				new Oscillator().toMaster().start();
			}, 0.01).then(function(buffer){
				BufferTest(buffer);
				expect(buffer.isSilent()).to.be.false;
			});
		});

		it ("can schedule specific timing outputs", function(){
			return Offline(function(){
				new Oscillator().toMaster().start(0.05);
			}, 0.1).then(function(buffer){
				BufferTest(buffer);
				expect(buffer.getFirstSoundTime()).to.be.closeTo(0.05, 0.0001);
			});
		});

		it ("can schedule Transport events", function(){
			return Offline(function(Transport){
				var osc = new Oscillator().toMaster();
				Transport.schedule(function(time){
					osc.start(time);
				}, 0.05);
				Transport.start(0);
			}, 0.1).then(function(buffer){
				BufferTest(buffer);
				expect(buffer.getFirstSoundTime()).to.be.closeTo(0.05, 0.001);
			});
		});

	});
});