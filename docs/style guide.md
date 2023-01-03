For testing: 
- try to use .toMatchSnapshot() when possible / relevant. Using asFragment will help bypass issues with useContext:
```jsx
  it('should match DOM and render "Weight per Tier (%)", "1st place winner" etc. if bounty type is 2', () => {
    const { asFragment } = render(<SetTierAdminPage bounty={Constants.bounty2} />);
    expect(asFragment()).toMatchSnapshot();
```
- to shallow render and use .toMatchSnapshot() (i.e. limit the test to the component itself) you can do:
```jsx 
import ShallowRenderer from 'react-test-renderer/shallow';
it('should render match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<MyComponent />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
``` 

When dispalying that could require ternaries, don't use ternaries unless its really simple.
For example:
```jsx 
<div>{!(types.includes('0')|| types.includes('1')&&( types.includes('2') && types.includes('3')))? 'Ready to Hack': 'Ready for Work'}</div>
```

Instead use functions and/or objects:
```jsx 
  const getReadyText = (isContest) => {
    if (isContest) {
      return 'Ready to Hack';
    } else return 'Ready for Work';
  };

  const isOnlyContest = (types) => {
    const includesReady = types.includes('2') || types.includes('3');
    const inlcudesNonReady = types.includes('0') && types.includes('1');
    return includesReady && !inlcudesNonReady;
  };

  const READY_TEXT = getReadyText(isOnlyContest(types));
return(
<div>{READY_TEXT}</div>
)
```
or
```jsx 
  getBountyTypeName = (types) => {
  if(types.length>1) return 'Unknown'

    switch (bounty.bountyType) {
      case '0':
        return 'Fixed Price';
      case '1':
        return 'Split Price';
      case '2':
        return 'Contest';
      case '3':
        return 'Contest';
	  default:
	  	return 'Unknown'
    }
  };  

  const READY_TEXT ={
  ['Contest']: 'Ready to Hack',
  ['Fixed Price']: 'Ready for Work',
  ['Split Price']: 'Ready for Work',
  ['Unknown']:'Ready for Work',
  }

return(
<div>{READY_TEXT}</div>
)
```

When adding api calls or ethers calls, first create a mock, then create UI based on the mock, then finally keep the mock in the appropriate mockClient and add the real call. This will ensure our tests and mock environment are resiliant as we grow.