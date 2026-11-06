from typing import List, Optional, Union
from pydantic import BaseModel, Field, model_validator

class InquiryCreate(BaseModel):
    client: Optional[str] = Field(None, example="College merchandise supplier")
    business: Optional[str] = Field(None, example="College merchandise supplier")
    product: Optional[str] = Field(None, example="Customised T-shirts")
    quantity: Optional[Union[int, str]] = Field(None, example=50)
    budget: Optional[str] = Field(None, example="₹15,000")
    budgetRange: Optional[str] = Field(None, example="₹15,000")
    delivery: Optional[str] = Field(None, example="10 days")
    timeline: Optional[str] = Field(None, example="10 days")
    sourceType: str = Field("Web Form / Direct Inquiry", example="Customer Portal RFP")
    keyItems: List[str] = Field(default_factory=list, example=["Customised T-shirts (50 qty)", "Delivery in 10 days"])

    @model_validator(mode="after")
    def normalize_fields(self):
        if not self.client and self.business:
            self.client = self.business
        if not self.client:
            self.client = "Direct Client Inquiry"

        if not self.budgetRange and self.budget:
            self.budgetRange = self.budget
        if not self.budgetRange:
            self.budgetRange = "Standard Commercial"

        if not self.timeline and self.delivery:
            self.timeline = f"{self.delivery} Turnaround" if "Turnaround" not in str(self.delivery) else str(self.delivery)
        if not self.timeline:
            self.timeline = "Standard Schedule"

        items = list(self.keyItems)
        if self.product and not any("product" in str(x).lower() or str(self.product).lower() in str(x).lower() for x in items):
            items.append(f"Product: {self.product}")
        if self.quantity and not any("quantity" in str(x).lower() or str(self.quantity) in str(x) for x in items):
            items.append(f"Quantity: {self.quantity} units")
        if self.delivery and not any("delivery" in str(x).lower() or str(self.delivery).lower() in str(x).lower() for x in items):
            items.append(f"Delivery: {self.delivery}")

        self.keyItems = items
        return self

class InquiryResponse(BaseModel):
    id: str
    client: str
    sourceType: str
    status: str
    budgetRange: str
    timeline: str
    keyItems: List[str]
    createdAt: str
    updatedAgent: Optional[dict] = None
    newLog: Optional[dict] = None

    class Config:
        from_attributes = True


