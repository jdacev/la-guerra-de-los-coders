package com.ga.robocode.dto;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Result {
	
	private String winner;
	private ArrayList<RobotResult> robotResults;
	
	public String getWinner() {
		return winner;
	}
	public void setWinner(String winner) {
		this.winner = winner;
	}
	public ArrayList<RobotResult> getRobotResults() {
		return robotResults;
	}
	public void setRobotResults(ArrayList<RobotResult> robotResults) {
		this.robotResults = robotResults;
	}
	
	public void addRobotResult(RobotResult robotResult) {
		
		if(robotResults == null){
			robotResults = new ArrayList<RobotResult>();
		}
		
		robotResults.add(robotResult);
		
	}

	
}
