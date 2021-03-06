package com.mycompany.myapp.service.dto;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Sphere entity.
 */
public class SphereDTO implements Serializable {

    private Long id;

    private String nom;

    private Long administrateurId;

    private String administrateurLogin;

    private Set<UserDTO> abonnes = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Long getAdministrateurId() {
        return administrateurId;
    }

    public void setAdministrateurId(Long userId) {
        this.administrateurId = userId;
    }

    public String getAdministrateurLogin() {
        return administrateurLogin;
    }

    public void setAdministrateurLogin(String userLogin) {
        this.administrateurLogin = userLogin;
    }

    public Set<UserDTO> getAbonnes() {
        return abonnes;
    }

    public void setAbonnes(Set<UserDTO> users) {
        this.abonnes = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SphereDTO sphereDTO = (SphereDTO) o;
        if(sphereDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sphereDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SphereDTO{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
