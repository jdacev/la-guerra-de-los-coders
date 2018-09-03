package com.ga.robocode.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Engine {
	
	@XmlElement
	private String nombre;
	@XmlElement
	private String ip;

	@XmlElement
	private String puerto;
	
	public Engine(){
	}
	
	public Engine(String nombre, String ip, String puerto){
		this.nombre = nombre;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getPuerto() {
		return puerto;
	}

	public void setPuerto(String puerto) {
		this.puerto = puerto;
	}
	
	@Override
	public String toString() {
		return "Engine [nombre=" + nombre + ";ip=" + ip + ";puerto=" + puerto + "]";
	 } 

}
