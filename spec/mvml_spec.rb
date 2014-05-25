require './mvml'

spec = './spec/data/valid.0.1.mvml'

describe MVML do
  describe '.convert_rotation' do
    context '"(x,y,z)" notation in degrees' do
      subject { MVML.convert_rotation '(0, 180,-90)' }
      it 'converts to radians' do
        subject.should =~ /^\(0.0,3.1415926.*,-1.5707963.*\)$/
      end
    end
  end

  describe '.parse' do
    context 'MVML spec' do
      subject { MVML.parse spec }
      it 'returns a templating hash' do
        subject.class.should equal Hash
      end
      it 'with a title' do
        subject.should include "title"
      end
      it 'and primitives' do
        subject.should include "primitives"
        subject['primitives'].count.should equal 3
      end
      it 'and meshes' do
        subject.should include "meshes"
        subject['meshes'].count.should equal 1
      end
    end
  end

  describe '.read' do
    context 'MVML spec' do
      subject { MVML.read spec }
      it 'creates a Hash' do
        subject.class.should equal Hash
      end
    end
  end

  describe '.to_html' do
    context 'MVML spec' do
      subject { MVML.to_html spec }
      it 'creates a WebGL/three.js HTML' do
        subject.should include '<html lang="en">'
        subject.should =~ /three.*js/
      end
    end
  end
end
