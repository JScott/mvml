require './mvml'

spec_mvml = IO.read './spec/data/spec.mvml'
blank_mvml = IO.read './spec/data/blank.mvml'
#TODO: empty_mvml with scaffolding but no data

describe MVML do
  describe '.convert_rotation' do
    context 'with degrees in "(x,y,z)" notation' do
      subject { MVML.convert_rotation '(0, 180,-90)' }
      it 'converts to radians' do
        expect(subject).to match /^\(0.0,3.1415926.*,-1.5707963.*\)$/
      end
    end
  end

  describe '.parse' do
    context 'with the MVML spec file' do
      subject { MVML.parse spec_mvml }
      it 'returns a templating hash' do
        expect(subject.class).to equal Hash
      end
      it 'returns a title' do
        expect(subject).to include "title"
      end
      it 'returns a message of the day' do
        expect(subject).to include "motd"
      end
      it 'returns player rules' do
        expect(subject).to include "player"
        expect(subject['player'].count).to be > 0
      end
      it 'returns primitives' do
        expect(subject).to include "primitives"
        expect(subject['primitives'].count).to be > 0
      end
      it 'returns meshes' do
        expect(subject).to include "meshes"
        expect(subject['meshes'].count).to be > 0
      end
    end
		context 'with a blank MVML file' do
			subject { MVML.parse blank_mvml }
      it 'returns a templating hash' do
        expect(subject.class).to equal Hash
      end
		end
  end

  describe '.to_html' do
    context 'with the MVML spec file' do
      subject { MVML.to_html spec_mvml }
      it 'generates WebGL/three.js HTML' do
        expect(subject).to include '<html lang="en">'
        expect(subject).to match /three.*js/
      end
      it 'generates a title' do
        expect(subject).to include '<title>'
      end
      it 'generates player rules' do
        expect(subject).to include ".position.set(0,0,30)"
        expect(subject).to include ".movementSpeed = 15"
        expect(subject).to include ".rollSpeed = 1.5"
        expect(subject).to include ".minJumpSpeed = 0"
        expect(subject).to include ".maxJumpSpeed = 20"
      end
      it 'generates one of each primitive' do
        expect(subject).to include 'BoxGeometry'
        expect(subject).to include 'SphereGeometry'
        expect(subject).to include 'PlaneGeometry'
      end
      it 'generates an invader mesh' do
        expect(subject).to include 'models/invader.obj.js'
      end
    end
  end
end
