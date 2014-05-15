require './mvml'

describe MVML do
  describe '.convert_rotation' do
    context '"x,y,z" notation in degrees' do
      subject { MVML.convert_rotation '0, 180,-90' }
      it 'converts to radians' do
        subject.should =~ /0,3.1415926.*,-1.5707963/
      end
    end
    context 'nil given' do
      subject { MVML.convert_rotation nil }
      it 'returns default rotation' do
        subject.should equal MVML.default[:rotation]
      end
    end
  end

  describe '.parse' do
    context 'example MVML' do
      subject { MVML.parse './spec/data/valid.mvml' }
      it 'returns a templating hash' do
        subject.class.should equal Hash
      end
      it 'populates a space title' do
        subject.should include "title"
      end
      it 'populates 2 models' do
        subject.should include "objects"
        subject['objects'].count.should equal 2
      end
    end
  end

  describe '.read' do
    context 'example MVML' do
      subject { MVML.read './spec/data/valid.mvml' }
      it 'represented in a Hash' do
        subject.class.should equal Hash
      end
    end
  end

  describe '.to_html' do
    context 'example MVML' do
      subject { MVML.to_html './spec/data/valid.mvml' }
      it 'returns WebGL HTML' do
        subject.should include '<html lang="en">'
        subject.should =~ /three.*js/
      end
    end
  end
end
