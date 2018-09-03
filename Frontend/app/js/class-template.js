function crearRobotClase(robotName, colors, features){
	var hitRobotCode = "";
	var scannedRobotCode = "";
	var bulletRobotCode = "";
	var wallRobotCode = "";
	var smartFireRequired = "";
	var turnCounter = "";
	var turnCounter2 = "";
	var turnCounter3 = "";
	var reverseDirectionRequired = "";
	var reverseDirectionRequired2 = "";
	var reverseDirectionRequired3 = "";
	var staticImportNormalRelative = "";

	if(features[0]=="hit1"){
		hitRobotCode = "		if (e.getBearing() > -10 && e.getBearing() < 10) {" + "\n" +
		"			fire(3);" + "\n" +
		"		}" + "\n" +
		"		if (e.isMyFault()) {" + "\n" +
		"			turnRight(10);" + "\n" +
		"		}" + "\n" ;
	}

	if(features[0]=="hit2"){
		hitRobotCode = "		if (e.getBearing() > -90 && e.getBearing() < 90) {" + "\n" +
			"		back(100);" + "\n" +
		"		}" + "\n" +
		"		else {" + "\n" +
		"			ahead(100);" + "\n" +
		"		}" + "\n" ;
	}

	if(features[0]=="hit3"){
		hitRobotCode = 	"		if (e.isMyFault()) {" + "\n" +
		"			reverseDirection();" + "\n" +
		"		}" + "\n" ;

		reverseDirectionRequired = "		public void reverseDirection() {" + "\n" +
		"			if (movingForward) {" + "\n" +
		"				setBack(40000);" + "\n" +
		"				movingForward = false;" + "\n" +
		"			} else {" + "\n" +
		"				setAhead(40000);" + "\n" +
		"				movingForward = true;" + "\n" +
		"			}" + "\n" +
		"		}";

		reverseDirectionRequired2 = "		boolean movingForward;" + "\n\n";
		reverseDirectionRequired3 = "		movingForward = true;" + "\n\n";
	}

	if(features[0]=="hit4"){
		hitRobotCode = "		double turnGunAmt = normalRelativeAngleDegrees(e.getBearing() + getHeading() - getGunHeading());" + "\n" +
		"		turnGunRight(turnGunAmt);" + "\n" +
		"		fire(3);" + "\n" ;

		staticImportNormalRelative = "import static robocode.util.Utils.normalRelativeAngleDegrees;\n";
	}

	if(features[1]=="scan1"){
		scanRobotCode = "		fire(3);" ;
	}

	if(features[1]=="scan2"){
		scanRobotCode = "		smartFire(e.getDistance());" + "\n" +
		"" + "\n" ;

		smartFireRequired = "	public void smartFire(double robotDistance) {" + "\n" + 
		"		if (robotDistance > 200 || getEnergy() < 15) {" + "\n" + 
		"			fire(1);" + "\n" + 
		"		} else if (robotDistance > 50) {" + "\n" + 
		"			fire(2);" + "\n" + 
		"		} else {" + "\n" + 
		"			fire(3);" + "\n" + 
		"		}" + "\n" +
		"	}" ;
	}

	if(features[1]=="scan3"){
		scanRobotCode = "		fire(2);" ;
	}

	if(features[1]=="scan4"){
		scanRobotCode = "		fire(1);" ;
	}

	if(features[2]=="hitBullet1"){
		bulletRobotCode = "		setTurnRate(5);" + "\n\n" ;
		turnCounter = "		int turnCounter;" + "\n\n";
		turnCounter2 = "		turnCounter = 0;\n\n";
		turnCounter3 = "		if (turnCounter % 64 == 0) {" + "\n" +
				"				setTurnRate(0);" + "\n" +
			"}" + "\n\n";
	}

	if(features[2]=="hitBullet2"){
		bulletRobotCode = "		if (e.getBearing() > -90 && e.getBearing() < 90) {" + "\n" + 
		"			back(100);" + "\n" + 
		"		}" + "\n" + 
		"		else {" + "\n" + 
		"			ahead(100);" + "\n" + 
		"		}" + "\n" ;
	}

	if(features[2]=="hitBullet3"){
		bulletRobotCode = "		double turnGunAmt = normalRelativeAngleDegrees(e.getBearing() + getHeading() - getGunHeading());" + "\n" + 
		"		turnGunRight(turnGunAmt);"  + "\n" +
		"		fire(3);" + "\n\n" ;

		staticImportNormalRelative = "import static robocode.util.Utils.normalRelativeAngleDegrees;\n";
	}

	if(features[3]=="hitWall1"){
		hitRobotCode = "		reverseDirection();" + "\n" ;

		reverseDirectionRequired = "		public void reverseDirection() {" + "\n" +
		"			if (movingForward) {" + "\n" +
		"				setBack(40000);" + "\n" +
		"				movingForward = false;" + "\n" +
		"			} else {" + "\n" +
		"				setAhead(40000);" + "\n" +
		"				movingForward = true;" + "\n" +
		"			}" + "\n" +
		"		}";

		reverseDirectionRequired2 = "		boolean movingForward;" + "\n\n";
		reverseDirectionRequired3 = "		movingForward = true;" + "\n\n";
	}	

	var classContent = "package com.grupoassa.robocode;" + "\n\n" +

	"import java.awt.Color;" +  "\n" +

	"import robocode.*;" + "\n" +

	staticImportNormalRelative + "\n" +

	"public class " + robotName + " extends RateControlRobot {" + "\n\n" +

		turnCounter + reverseDirectionRequired2 +

	"	public void run() {" + "\n" +

		turnCounter2 +
			
	"		// body, gun, radar, bullet, scanner" + "\n" +
	"		setBodyColor(" + colors[0] + ");" +  "\n" +
	"		setGunColor(" + colors[1] + ");" +  "\n" +
	"		setRadarColor(" + colors[2] + ");" + "\n" +
	"		setBulletColor(" + colors[3] + ");" + "\n" +
	"		setScanColor(" + colors[4] + ");" + "\n" +

	"		// Robot main loop" + "\n" +
	"		while(true) {" + "\n" +
				turnCounter3 + reverseDirectionRequired3 +
	"			ahead(100);" + "\n" +
	"			turnGunRight(360);" + "\n" +
	"			back(100); " + "\n" +
	"			turnGunRight(360);" + "\n" +
	"		}" + "\n" +
	"	}" + "\n\n" +

	"	public void onScannedRobot(ScannedRobotEvent e) {" + "\n" +
			scanRobotCode + "\n" +
	"	}" + "\n\n" +

	"	public void onHitByBullet(HitByBulletEvent e) {" + "\n" +
			bulletRobotCode + "\n" +
	"	}" + "\n\n" +

	"	public void onHitWall(HitWallEvent e) {" + "\n" +
			wallRobotCode + "\n" +
	"	}" + "\n\n" +

	"	public void onHitRobot(HitRobotEvent e) {" + "\n" +
			hitRobotCode + "\n" +
	"	}" + "\n\n" + smartFireRequired + "\n\n" + reverseDirectionRequired + "\n" +

	"}" + "\n";

	return classContent;
}