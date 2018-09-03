function robotTemplate(robotName, colors, type, userId){

	var classContent = "";
	
	if(type=='Crazy'){

	classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +


"import robocode.*;" + "\n" +

"import java.awt.*;" + "\n" +


"/**" + "\n" +
" * This robot moves around in a crazy pattern." + "\n" +
" *" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends AdvancedRobot {" + "\n" +
"	boolean movingForward;" + "\n\n" +
"	/**" + "\n" +
"	 * run: Crazy's main run function" + "\n" +
"	 */" + "\n" +
"	public void run() {" + "\n" +
"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		// Loop forever" + "\n" +
"		while (true) {" + "\n" +
"			// Tell the game we will want to move ahead 40000 -- some large number" + "\n" +
"			setAhead(40000);" + "\n" +
"			movingForward = true;" + "\n" +
"			// Tell the game we will want to turn right 90" + "\n" +
"			setTurnRight(90);" + "\n" +
"			// At this point, we have indicated to the game that *when we do something*," + "\n" +
"			// we will want to move ahead and turn right.  That's what 'set' means." + "\n" +
"			// It is important to realize we have not done anything yet!" + "\n" +
"			// In order to actually move, we'll want to call a method that" + "\n" +
"			// takes real time, such as waitFor." + "\n" +
"			// waitFor actually starts the action -- we start moving and turning." + "\n" +
"			// It will not return until we have finished turning." + "\n" +
"			waitFor(new TurnCompleteCondition(this));" + "\n" +
"			// Note:  We are still moving ahead now, but the turn is complete." + "\n" +
"			// Now we'll turn the other way..." + "\n" +
"			setTurnLeft(180);" + "\n" +
"			// ... and wait for the turn to finish ..." + "\n" +
"			waitFor(new TurnCompleteCondition(this));" + "\n" +
"			// ... then the other way ..." + "\n" +
"			setTurnRight(180);" + "\n" +
"			// .. and wait for that turn to finish." + "\n" +
"			waitFor(new TurnCompleteCondition(this));" + "\n" +
"			// then back to the top to do it all again" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onHitWall:  Handle collision with wall." + "\n" +
"	 */" + "\n" +
"	public void onHitWall(HitWallEvent e) {" + "\n" +
"		// Bounce off!" + "\n" +
"		reverseDirection();" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * reverseDirection:  Switch from ahead to back & vice versa" + "\n" +
"	 */" + "\n" +
"	public void reverseDirection() {" + "\n" +
"		if (movingForward) {" + "\n" +
"			setBack(40000);" + "\n" +
"			movingForward = false;" + "\n" +
"		} else {" + "\n" +
"			setAhead(40000);" + "\n" +
"			movingForward = true;" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onScannedRobot:  Fire!" + "\n" +
"	 */" + "\n" +
"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
"		fire(1);" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onHitRobot:  Back up!" + "\n" +
"	 */" + "\n" +
"	public void onHitRobot(HitRobotEvent e) {" + "\n" +
"		// If we're moving the other robot, reverse!" + "\n" +
"		if (e.isMyFault()) {" + "\n" +
"			reverseDirection();" + "\n" +
"		}" + "\n" +
"	}" + "\n" +
"}";
}

if(type=='Spin'){

	classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +

"import robocode.AdvancedRobot;" + "\n" +
"import robocode.HitRobotEvent;" + "\n" +
"import robocode.ScannedRobotEvent;" + "\n" +

"import java.awt.*;" + "\n\n" +


"/**" + "\n" +
" * Moves in a circle, firing hard when an enemy is detected." + "\n" +
" *" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends AdvancedRobot {" + "\n\n" +

"	/**" + "\n" +
"	 * SpinBot's run method - Circle" + "\n" +
"	 */" + "\n" +
"	public void run() {" + "\n" +
"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		// Loop forever" + "\n" +
"		while (true) {" + "\n" +
"			// Tell the game that when we take move," + "\n" +
"			// we'll also want to turn right... a lot." + "\n" +
"			setTurnRight(10000);" + "\n" +
"			// Limit our speed to 5" + "\n" +
"			setMaxVelocity(5);" + "\n" +
"			// Start moving (and turning)" + "\n" +
"			ahead(10000);" + "\n" +
"			// Repeat." + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onScannedRobot: Fire hard!" + "\n" +
"	 */" + "\n" +
"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
"		fire(3);" + "\n" +
"	}" + "\n\n" +

"	/**" + "\n" +
"	 * onHitRobot:  If it's our fault, we'll stop turning and moving," + "\n" +
"	 * so we need to turn again to keep spinning." + "\n" +
"	 */" + "\n" +
"	public void onHitRobot(HitRobotEvent e) {" + "\n" +
"		if (e.getBearing() > -10 && e.getBearing() < 10) {" + "\n" +
"			fire(3);" + "\n" +
"		}" + "\n" +
"		if (e.isMyFault()) {" + "\n" +
"			turnRight(10);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +
"}";

}

if(type=='Walls'){

	classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +

"import robocode.HitRobotEvent;" + "\n" +
"import robocode.Robot;" + "\n" +
"import robocode.ScannedRobotEvent;" + "\n" +

"import java.awt.*;" + "\n" +


"/**" + "\n" +
" * Moves around the outer edge with the gun facing in." + "\n" +
" *" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends Robot {" + "\n" +

"	boolean peek; // Don't turn if there's a robot there" + "\n" +
"	double moveAmount; // How much to move" + "\n" +

"	/**" + "\n" +
"	 * run: Move around the walls" + "\n" +
"	 */" + "\n" +
"	public void run() {" + "\n" +
"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		// Initialize moveAmount to the maximum possible for this battlefield." + "\n" +
"		moveAmount = Math.max(getBattleFieldWidth(), getBattleFieldHeight());" + "\n" +
"		// Initialize peek to false" + "\n" +
"		peek = false;" + "\n" +

"		// turnLeft to face a wall." + "\n" +
"		// getHeading() % 90 means the remainder of" + "\n" +
"		// getHeading() divided by 90." + "\n" +
"		turnLeft(getHeading() % 90);" + "\n" +
"		ahead(moveAmount);" + "\n" +
"		// Turn the gun to turn right 90 degrees." + "\n" +
"		peek = true;" + "\n" +
"		turnGunRight(90);" + "\n" +
"		turnRight(90);" + "\n" +

"		while (true) {" + "\n" +
"			// Look before we turn when ahead() completes." + "\n" +
"			peek = true;" + "\n" +
"			// Move up the wall" + "\n" +
"			ahead(moveAmount);" + "\n" +
"			// Don't look now" + "\n" +
"			peek = false;" + "\n" +
"			// Turn to the next wall" + "\n" +
"			turnRight(90);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onHitRobot:  Move away a bit." + "\n" +
"	 */" + "\n" +
"	public void onHitRobot(HitRobotEvent e) {" + "\n" +
"		// If he's in front of us, set back up a bit." + "\n" +
"		if (e.getBearing() > -90 && e.getBearing() < 90) {" + "\n" +
"			back(100);" + "\n" +
"		} // else he's in back of us, so set ahead a bit." + "\n" +
"		else {" + "\n" +
"			ahead(100);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onScannedRobot:  Fire!" + "\n" +
"	 */" + "\n" +
"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
"		fire(2);" + "\n" +
"		// Note that scan is called automatically when the robot is moving." + "\n" +
"		// By calling it manually here, we make sure we generate another scan event if there's a robot on the next" + "\n" +
"		// wall, so that we do not start moving up it until it's gone." + "\n" +
"		if (peek) {" + "\n" +
"			scan();" + "\n" +
"		}" + "\n" +
"	}" + "\n" +
"}";


}

if(type=='Tracker'){

	classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +


"import robocode.HitRobotEvent;" + "\n" +
"import robocode.Robot;" + "\n" +
"import robocode.ScannedRobotEvent;" + "\n" +
"import robocode.WinEvent;" + "\n" +
"import static robocode.util.Utils.normalRelativeAngleDegrees;" + "\n" +

"import java.awt.*;" + "\n" +


"/**" + "\n" +
" * Locks onto a robot, moves close, fires when close." + "\n" +
" *" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends Robot {" + "\n" +
"	int count = 0; // Keeps track of how long we've" + "\n" +
"	// been searching for our target" + "\n" +
"	double gunTurnAmt; // How much to turn our gun when searching" + "\n" +
"	String trackName; // Name of the robot we're currently tracking" + "\n" +

"	/**" + "\n" +
"	 * run:  Tracker's main run function" + "\n" +
"	 */" + "\n" +
"	public void run() {" + "\n" +
"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		// Prepare gun" + "\n" +
"		trackName = null; // Initialize to not tracking anyone" + "\n" +
"		setAdjustGunForRobotTurn(true); // Keep the gun still when we turn" + "\n" +
"		gunTurnAmt = 10; // Initialize gunTurn to 10" + "\n" +

"		// Loop forever" + "\n" +
"		while (true) {" + "\n" +
"			// turn the Gun (looks for enemy)" + "\n" +
"			turnGunRight(gunTurnAmt);" + "\n" +
"			// Keep track of how long we've been looking" + "\n" +
"			count++;" + "\n" +
"			// If we've haven't seen our target for 2 turns, look left" + "\n" +
"			if (count > 2) {" + "\n" +
"				gunTurnAmt = -10;" + "\n" +
"			}" + "\n" +
"			// If we still haven't seen our target for 5 turns, look right" + "\n" +
"			if (count > 5) {" + "\n" +
"				gunTurnAmt = 10;" + "\n" +
"			}" + "\n" +
"			// If we *still* haven't seen our target after 10 turns, find another target" + "\n" +
"			if (count > 11) {" + "\n" +
"				trackName = null;" + "\n" +
"			}" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onScannedRobot:  Here's the good stuff" + "\n" +
"	 */" + "\n" +
"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +

"		// If we have a target, and this isn't it, return immediately" + "\n" +
"		// so we can get more ScannedRobotEvents." + "\n" +
"		if (trackName != null && !e.getName().equals(trackName)) {" + "\n" +
"			return;" + "\n" +
"		}" + "\n" +

"		// This is our target.  Reset count (see the run method)" + "\n" +
"		count = 0;" + "\n" +
"		// If our target is too far away, turn and move toward it." + "\n" +
"		if (e.getDistance() > 150) {" + "\n" +
"			gunTurnAmt = normalRelativeAngleDegrees(e.getBearing() + (getHeading() - getRadarHeading()));" + "\n" +

"			turnGunRight(gunTurnAmt); // Try changing these to setTurnGunRight," + "\n" +
"			turnRight(e.getBearing()); // and see how much Tracker improves..." + "\n" +
"			// (you'll have to make Tracker an AdvancedRobot)" + "\n" +
"			ahead(e.getDistance() - 140);" + "\n" +
"			return;" + "\n" +
"		}" + "\n" +

"		// Our target is close." + "\n" +
"		gunTurnAmt = normalRelativeAngleDegrees(e.getBearing() + (getHeading() - getRadarHeading()));" + "\n" +
"		turnGunRight(gunTurnAmt);" + "\n" +
"		fire(3);" + "\n" +

"		// Our target is too close!  Back up." + "\n" +
"		if (e.getDistance() < 100) {" + "\n" +
"			if (e.getBearing() > -90 && e.getBearing() <= 90) {" + "\n" +
"				back(40);" + "\n" +
"			} else {" + "\n" +
"				ahead(40);" + "\n" +
"			}" + "\n" +
"		}" + "\n" +
"		scan();" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onHitRobot:  Set him as our new target" + "\n" +
"	 */" + "\n" +
"	public void onHitRobot(HitRobotEvent e) {" + "\n" +
"		// Set the target" + "\n" +
"		trackName = e.getName();" + "\n" +
"		// Back up a bit." + "\n" +
"		// Note:  We won't get scan events while we're doing this!" + "\n" +
"		// An AdvancedRobot might use setBack(); execute();" + "\n" +
"		gunTurnAmt = normalRelativeAngleDegrees(e.getBearing() + (getHeading() - getRadarHeading()));" + "\n" +
"		turnGunRight(gunTurnAmt);" + "\n" +
"		fire(3);" + "\n" +
"		back(50);" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onWin:  Do a victory dance" + "\n" +
"	 */" + "\n" +
"	public void onWin(WinEvent e) {" + "\n" +
"		for (int i = 0; i < 50; i++) {" + "\n" +
"			turnRight(30);" + "\n" +
"			turnLeft(30);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +
"}";


}

if(type=='Fire'){

	classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +

"import robocode.HitByBulletEvent;" + "\n" +
"import robocode.HitRobotEvent;" + "\n" +
"import robocode.Robot;" + "\n" +
"import robocode.ScannedRobotEvent;" + "\n" +
"import static robocode.util.Utils.normalRelativeAngleDegrees;" + "\n" +

"import java.awt.*;" + "\n" +


"/**" + "\n" +
" * Fire - a sample robot by Mathew Nelson, and maintained." + "\n" +
" * Sits still. Spins gun around. Moves when hit." + "\n" +
" *" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends Robot {" + "\n" +
"	int dist = 50; // distance to move when we're hit" + "\n" +

"	/**" + "\n" +
"	 * run:  Fire's main run function" + "\n" +
"	 */" + "\n" +
"	public void run() {" + "\n" +
"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		// Spin the gun around slowly... forever" + "\n" +
"		while (true) {" + "\n" +
"			turnGunRight(5);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onScannedRobot:  Fire!" + "\n" +
"	 */" + "\n" +
"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
"		// If the other robot is close by, and we have plenty of life," + "\n" +
"		// fire hard!" + "\n" +
"		if (e.getDistance() < 50 && getEnergy() > 50) {" + "\n" +
"			fire(3);" + "\n" +
"		} // otherwise, fire 1." + "\n" +
"		else {" + "\n" +
"			fire(1);" + "\n" +
"		}" + "\n" +
"		// Call scan again, before we turn the gun" + "\n" +
"		scan();" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onHitByBullet:  Turn perpendicular to the bullet, and move a bit." + "\n" +
"	 */" + "\n" +
"	public void onHitByBullet(HitByBulletEvent e) {" + "\n" +
"		turnRight(normalRelativeAngleDegrees(90 - (getHeading() - e.getHeading())));" + "\n" +

"		ahead(dist);" + "\n" +
"		dist *= -1;" + "\n" +
"		scan();" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onHitRobot:  Aim at it.  Fire Hard!" + "\n" +
"	 */" + "\n" +
"	public void onHitRobot(HitRobotEvent e) {" + "\n" +
"		double turnGunAmt = normalRelativeAngleDegrees(e.getBearing() + getHeading() - getGunHeading());" + "\n" +

"		turnGunRight(turnGunAmt);" + "\n" +
"		fire(3);" + "\n" +
"	}" + "\n" +
"}";


}

if(type=='Corners'){

	classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +

"import robocode.DeathEvent;" + "\n" +
"import robocode.Robot;" + "\n" +
"import robocode.ScannedRobotEvent;" + "\n" +
"import static robocode.util.Utils.normalRelativeAngleDegrees;" + "\n" +

"import java.awt.*;" + "\n" +


"/**" + "\n" +
" * This robot moves to a corner, then swings the gun back and forth." + "\n" +
" * If it dies, it tries a new corner in the next round." + "\n" +
" *" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends Robot {" + "\n" +
"	int others; // Number of other robots in the game" + "\n" +
"	static int corner = 0; // Which corner we are currently using" + "\n" +
"	// static so that it keeps it between rounds." + "\n" +
"	boolean stopWhenSeeRobot = false; // See goCorner()" + "\n" +

"	/**" + "\n" +
"	 * run:  Corners' main run function." + "\n" +
"	 */" + "\n" +
"	public void run() {" + "\n" +
"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		// Save # of other bots" + "\n" +
"		others = getOthers();" + "\n" +

"		// Move to a corner" + "\n" +
"		goCorner();" + "\n" +

"		// Initialize gun turn speed to 3" + "\n" +
"		int gunIncrement = 3;" + "\n" +

"		// Spin gun back and forth" + "\n" +
"		while (true) {" + "\n" +
"			for (int i = 0; i < 30; i++) {" + "\n" +
"				turnGunLeft(gunIncrement);" + "\n" +
"			}" + "\n" +
"			gunIncrement *= -1;" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * goCorner:  A very inefficient way to get to a corner.  Can you do better?" + "\n" +
"	 */" + "\n" +
"	public void goCorner() {" + "\n" +
"		// We don't want to stop when we're just turning..." + "\n" +
"		stopWhenSeeRobot = false;" + "\n" +
"		// turn to face the wall to the 'right' of our desired corner." + "\n" +
"		turnRight(normalRelativeAngleDegrees(corner - getHeading()));" + "\n" +
"		// Ok, now we don't want to crash into any robot in our way..." + "\n" +
"		stopWhenSeeRobot = true;" + "\n" +
"		// Move to that wall" + "\n" +
"		ahead(5000);" + "\n" +
"		// Turn to face the corner" + "\n" +
"		turnLeft(90);" + "\n" +
"		// Move to the corner" + "\n" +
"		ahead(5000);" + "\n" +
"		// Turn gun to starting point" + "\n" +
"		turnGunLeft(90);" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"  * onScannedRobot:  Stop and fire!" + "\n" +
"	 */" + "\n" +
"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
"		// Should we stop, or just fire?" + "\n" +
"		if (stopWhenSeeRobot) {" + "\n" +
"			// Stop everything!  You can safely call stop multiple times." + "\n" +
"			stop();" + "\n" +
"			// Call our custom firing method" + "\n" +
"			smartFire(e.getDistance());" + "\n" +
"			// Look for another robot." + "\n" +
"			// NOTE:  If you call scan() inside onScannedRobot, and it sees a robot," + "\n" +
"			// the game will interrupt the event handler and start it over" + "\n" +
"			scan();" + "\n" +
"			// We won't get here if we saw another robot." + "\n" +
"			// Okay, we didn't see another robot... start moving or turning again." + "\n" +
"			resume();" + "\n" +
"		} else {" + "\n" +
"			smartFire(e.getDistance());" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * smartFire:  Custom fire method that determines firepower based on distance." + "\n" +
"	 *" + "\n" +
"	 * @param robotDistance the distance to the robot to fire at" + "\n" +
"	 */" + "\n" +
"	public void smartFire(double robotDistance) {" + "\n" +
"		if (robotDistance > 200 || getEnergy() < 15) {" + "\n" +
"			fire(1);" + "\n" +
"		} else if (robotDistance > 50) {" + "\n" +
"			fire(2);" + "\n" +
"		} else {" + "\n" +
"			fire(3);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	/**" + "\n" +
"	 * onDeath:  We died.  Decide whether to try a different corner next game." + "\n" +
"	 */" + "\n" +
"	public void onDeath(DeathEvent e) {" + "\n" +
"		// Well, others should never be 0, but better safe than sorry." + "\n" +
"		if (others == 0) {" + "\n" +
"			return;" + "\n" +
"		}" + "\n" +

"		// If 75% of the robots are still alive when we die, we'll switch corners." + "\n" +
"		if ((others - getOthers()) / (double) others < .75) {" + "\n" +
"			corner += 90;" + "\n" +
"			if (corner == 270) {" + "\n" +
"				corner = -90;" + "\n" +
"			}" + "\n" +
"			//out.println('I died and did poorly... switching corner to ' + corner);" + "\n" +
"		} else {" + "\n" +
"			//out.println('I died but did well.  I will still use corner ' + corner);" + "\n" +
"		}" + "\n" +
"	}" + "\n" +
"}";
}

	if(type=="VelociRobot"){

		classContent = "package com.grupoassa.robocode.user" + userId + ";" + "\n" +

"import robocode.HitByBulletEvent;" + "\n" +
"import robocode.HitWallEvent;" + "\n" +
"import robocode.RateControlRobot;" + "\n" +
"import robocode.ScannedRobotEvent;" + "\n" +
"import java.awt.*;" + "\n" +


"/**" + "\n" +
" * This is a sample of a robot using the RateControlRobot class" + "\n" +
" */" + "\n" +
"public class " + robotName + " extends RateControlRobot {" + "\n" +

"	int turnCounter;" + "\n" +
"	public void run() {" + "\n" +

"		// Set colors" + "\n" +
"		// body, gun, radar, bullet, scanner" + "\n" +
"		setBodyColor(" + colors[0] + ");" +  "\n" +
"		setGunColor(" + colors[1] + ");" +  "\n" +
"		setRadarColor(" + colors[2] + ");" + "\n" +
"		setBulletColor(" + colors[3] + ");" + "\n" +
"		setScanColor(" + colors[4] + ");" + "\n" +

"		turnCounter = 0;" + "\n" +
"		setGunRotationRate(15);" + "\n" +
		
"		while (true) {" + "\n" +
"			if (turnCounter % 64 == 0) {" + "\n" +
"				// Straighten out, if we were hit by a bullet and are turning" + "\n" +
"				setTurnRate(0);" + "\n" +
"				// Go forward with a velocity of 4" + "\n" +
"				setVelocityRate(4);" + "\n" +
"			}" + "\n" +
"			if (turnCounter % 64 == 32) {" + "\n" +
"				// Go backwards, faster" + "\n" +
"				setVelocityRate(-6);" + "\n" +
"			}" + "\n" +
"			turnCounter++;" + "\n" +
"			execute();" + "\n" +
"		}" + "\n" +
"	}" + "\n" +

"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
"		fire(1);" + "\n" +
"	}" + "\n" +

"	public void onHitByBullet(HitByBulletEvent e) {" + "\n" +
"		// Turn to confuse the other robot" + "\n" +
"		setTurnRate(5);" + "\n" +
"	}" + "\n" +
	
"	public void onHitWall(HitWallEvent e) {" + "\n" +
"		// Move away from the wall" + "\n" +
"		setVelocityRate(-1 * getVelocityRate());" + "\n" +
"	}" + "\n" +
"}";

}

	return classContent;
}