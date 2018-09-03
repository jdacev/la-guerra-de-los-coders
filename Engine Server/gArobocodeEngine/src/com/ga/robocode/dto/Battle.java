package com.ga.robocode.dto;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Battle {

	@XmlElement
	private String jarName;
	
	@XmlElement
	private String jarFile;
	
	@XmlElement
	private ArrayList<String> robots;

	public String getJarName() {
		return jarName;
	}

	public void setJarName(String jarName) {
		this.jarName = jarName;
	}

	public String getJarFile() {
		return jarFile;
	}

	public void setJarFile(String jarFile) {
		this.jarFile = jarFile;
	}

	public ArrayList<String> getRobots() {
		return robots;
	}

	public void setRobots(ArrayList<String> robots) {
		this.robots = robots;
	}
	
	@Override
	public String toString() {
		return "Battle [jarName=" + jarName + ";Robots=" + robots + "]";
	} 
}
