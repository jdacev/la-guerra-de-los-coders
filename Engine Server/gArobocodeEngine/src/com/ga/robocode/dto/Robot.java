package com.ga.robocode.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Robot {
	
	@XmlElement
	private String name;
	@XmlElement
	private String file;
	
	public Robot(){
		
	}
	
	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getFile() {
		return file;
	}


	public void setFile(String file) {
		this.file = file;
	}


	@Override
	public String toString() {
		return "Robot [name=" + name + ";file=" + file + "]";
	} 

}
