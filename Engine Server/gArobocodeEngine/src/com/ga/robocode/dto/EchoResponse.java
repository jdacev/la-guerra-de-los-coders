package com.ga.robocode.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class EchoResponse {
	
	@XmlElement
	private String rc;

	public String getRc() {
		return rc;
	}

	public void setRc(String rc) {
		this.rc = rc;
	}
	
}
