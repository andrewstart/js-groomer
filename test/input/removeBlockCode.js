this.lineShouldNotBeTouched();
// this line should get found
class ShouldGetRemoved {
    //should get removed before getting hit
    doesAThing();
    fakeInternalBlock {
    }
}
this.lineShouldBeFine();