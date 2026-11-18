package com.omsairam.juice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @Column(length = 60)
    private String id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(length = 40)
    private String icon;

    @Column(nullable = false)
    private int sortOrder = 0;

    public Category() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
